import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export async function POST(request: Request) {
  try {
    // Validate environment variables
    if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_AUDIENCE_ID || !process.env.MAILCHIMP_SERVER_PREFIX) {
      console.error('Missing required environment variables');
      return Response.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Trim and lowercase email
    const cleanEmail = email.trim().toLowerCase();

    await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
      email_address: cleanEmail,
      status: 'subscribed',
    });

    return Response.json({ success: true, message: 'Successfully subscribed!' });
  } catch (error: any) {
    console.error('Mailchimp subscription error:', error);
    
    // Log the detailed error response for debugging
    if (error.response) {
      console.error('Mailchimp error response body:', error.response.body);
      console.error('Mailchimp error response text:', error.response.text);
    }
    
    // Handle member already exists
    if (error.status === 400) {
      try {
        let errorBody;
        
        // Try to get the error body from different possible locations
        if (error.response?.body) {
          errorBody = typeof error.response.body === 'string' 
            ? JSON.parse(error.response.body) 
            : error.response.body;
        } else if (error.response?.text) {
          errorBody = typeof error.response.text === 'string'
            ? JSON.parse(error.response.text)
            : error.response.text;
        }
        
        if (errorBody?.title === 'Member Exists') {
          return Response.json({ error: 'Email is already subscribed' }, { status: 400 });
        }
        
        // Return the specific error from Mailchimp
        if (errorBody?.detail) {
          return Response.json({ error: errorBody.detail }, { status: 400 });
        }
        
        if (errorBody?.title) {
          return Response.json({ error: errorBody.title }, { status: 400 });
        }
      } catch (parseError) {
        console.error('Error parsing Mailchimp response:', parseError);
      }
    }

    return Response.json({ 
      error: 'Failed to subscribe. Please check your email address and try again.' 
    }, { status: 500 });
  }
}