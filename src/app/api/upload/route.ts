import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Prompt, UploadPromptRequest } from '@/data/schema';

// 🔥 NEXT.JS FEATURE: API Routes with App Router
// This creates an API endpoint at /api/upload

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: UploadPromptRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.description || !body.content || !body.category || !body.author) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate a unique ID for the prompt
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const id = `${body.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').substring(0, 30)}-${randomSuffix}`;

    // Create the new prompt object
    const newPrompt: Prompt = {
      id,
      name: body.name.trim(),
      description: body.description.trim(),
      content: body.content.trim(),
      category: body.category,
      difficulty: body.difficulty || 'beginner',
      tags: body.tags || [],
      author: body.author.trim(),
      version: '1.0.0',
      license: body.license || 'MIT',
      rating: 0, // New prompts start with 0 rating
      downloads: 0, // New prompts start with 0 downloads
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sourceUrl: body.sourceUrl?.trim() || undefined
    };

    // Read existing prompts
    const promptsFilePath = path.join(process.cwd(), 'src/data/prompts.json');
    let existingPrompts: Prompt[] = [];
    
    try {
      const fileContent = fs.readFileSync(promptsFilePath, 'utf8');
      existingPrompts = JSON.parse(fileContent);
    } catch (error) {
      console.warn('Could not read existing prompts file, starting with empty array');
    }

    // Check for duplicate IDs (very unlikely but good to be safe)
    if (existingPrompts.some(prompt => prompt.id === id)) {
      return NextResponse.json(
        { message: 'A prompt with this ID already exists. Please try again.' },
        { status: 409 }
      );
    }

    // Add the new prompt to the array
    existingPrompts.push(newPrompt);

    // Write back to the file
    fs.writeFileSync(promptsFilePath, JSON.stringify(existingPrompts, null, 2), 'utf8');

    // Return success response
    return NextResponse.json({
      message: 'Prompt uploaded successfully',
      id: newPrompt.id,
      prompt: newPrompt
    }, { status: 201 });

  } catch (error) {
    console.error('Upload API error:', error);
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 🔥 NEXT.JS FEATURE: HTTP Methods
// You can export GET, POST, PUT, DELETE, etc.
export async function GET() {
  return NextResponse.json({ message: 'Upload endpoint - use POST to upload prompts' });
}
