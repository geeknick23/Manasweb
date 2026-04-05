#!/usr/bin/env python3
"""Generate logo variations for Manas Bandhan using Gemini image generation."""

import os
import sys
import time
import base64

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Install with: pip install google-genai")
    sys.exit(1)

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("Set GEMINI_API_KEY environment variable")
    sys.exit(1)

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

# Try multiple models in order of preference
MODELS = [
    "gemini-2.0-flash-preview-image-generation",
    "gemini-2.0-flash-exp-image-generation", 
    "gemini-2.0-flash-exp",
]

PROMPTS = [
    # Variation 1: Elegant woman silhouette with flowing curves
    "Minimalist abstract logo icon. Stylized elegant abstract woman silhouette in flowing graceful pose symbolizing strength and new beginnings. Royal purple and warm gold colors. Clean modern vector flat design. Icon only, absolutely no text. Pure white background. Professional app icon quality.",
    
    # Variation 2: Two abstract figures forming connection
    "Abstract geometric logo icon. Two stylized abstract human figures, one clearly feminine, forming a heart or connection shape together. Deep teal and magenta with gold accent. Minimalist modern flat design. Icon only, no text at all. White background. App icon quality.",
    
    # Variation 3: Woman with lotus motif
    "Elegant minimalist logo icon. Abstract woman silhouette integrated with lotus petal motif symbolizing resilience and rebirth. Rich purple-to-teal gradient. Modern flat design with clean curves. Icon only, no text. White background. Professional quality.",
    
    # Variation 4: Circular flowing woman form
    "Modern abstract logo icon. Stylized abstract woman silhouette with flowing curves forming a circular shape representing wholeness and connection. Deep coral and warm copper colors. Sophisticated minimal design. Icon only, no text. White background. App icon.",
    
    # Variation 5: Butterfly/wings transformation
    "Premium minimalist logo icon. Abstract feminine figure with flowing curves forming butterfly wings shape symbolizing transformation and freedom. Jewel-toned emerald green and gold. Clean geometric modern design. Icon only, no text. White background. Professional.",
]

def generate_logo(client, model_name, prompt, output_path):
    """Generate a single logo."""
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
            )
        )
        
        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                image_data = part.inline_data.data
                with open(output_path, "wb") as f:
                    f.write(image_data)
                return True
        
        print(f"  No image in response for {output_path}")
        return False
        
    except Exception as e:
        print(f"  Error: {e}")
        return False

def main():
    client = genai.Client(api_key=API_KEY)
    
    working_model = None
    
    # Find a working model
    for model in MODELS:
        print(f"Trying model: {model}...")
        try:
            response = client.models.generate_content(
                model=model,
                contents="Generate a simple purple circle on white background",
                config=types.GenerateContentConfig(
                    response_modalities=["IMAGE", "TEXT"],
                )
            )
            for part in response.candidates[0].content.parts:
                if part.inline_data is not None:
                    working_model = model
                    print(f"  ✓ Model {model} works!")
                    # Save this test image too
                    with open(os.path.join(OUTPUT_DIR, "test.png"), "wb") as f:
                        f.write(part.inline_data.data)
                    break
            if working_model:
                break
        except Exception as e:
            print(f"  ✗ {model}: {e}")
            continue
    
    if not working_model:
        print("\nNo working model found. All models are unavailable.")
        sys.exit(1)
    
    print(f"\nUsing model: {working_model}")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Generating {len(PROMPTS)} logo variations...\n")
    
    successes = 0
    for i, prompt in enumerate(PROMPTS, 1):
        output_path = os.path.join(OUTPUT_DIR, f"logo-{i:02d}.png")
        print(f"[{i}/{len(PROMPTS)}] Generating logo-{i:02d}.png...")
        
        if generate_logo(client, working_model, prompt, output_path):
            print(f"  ✓ Saved: {output_path}")
            successes += 1
        
        # Delay between generations to avoid rate limits
        if i < len(PROMPTS):
            print("  Waiting 8s...")
            time.sleep(8)
    
    print(f"\nDone! Generated {successes}/{len(PROMPTS)} logos.")
    print(f"Output: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
