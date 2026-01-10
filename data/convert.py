import json
import uuid
import os

# --- CONFIGURATION ---
INPUT_FILENAME = 'data.json'        # The file you want to convert
OUTPUT_FILENAME = 'data_fixed.json' # The new file to create

def generate_uuid():
    return str(uuid.uuid4())

def process_data(data):
    """
    Iterates through the data structure and reconstructs it with IDs 
    placed at the beginning of the objects.
    """
    new_data = []

    for category in data:
        # 1. Process the words list first
        original_words = category.get('words', [])
        new_words_list = []

        for word in original_words:
            # Create a new word object. 
            # If 'id' already exists, keep it. If not, generate new one.
            word_id = word.get('id', generate_uuid())
            
            # Reconstruct dictionary to put 'id' first
            new_word = {'id': word_id}
            # Add all other properties from the original word
            for key, value in word.items():
                if key != 'id':
                    new_word[key] = value
            
            new_words_list.append(new_word)

        # 2. Process the Category object
        category_id = category.get('id', generate_uuid())
        
        # Reconstruct category dictionary to put 'id' first
        new_category = {'id': category_id}
        
        # Add other properties, but replace 'words' with our new list
        for key, value in category.items():
            if key == 'words':
                new_category['words'] = new_words_list
            elif key != 'id':
                new_category[key] = value
        
        new_data.append(new_category)

    return new_data

def main():
    # Check if input file exists
    if not os.path.exists(INPUT_FILENAME):
        print(f"Error: Could not find '{INPUT_FILENAME}' in this folder.")
        print("Please make sure your JSON file is named correctly.")
        return

    try:
        print(f"Reading from {INPUT_FILENAME}...")
        with open(INPUT_FILENAME, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if not isinstance(data, list):
            print("Error: JSON root must be a list []")
            return

        # Process the data
        fixed_data = process_data(data)

        # Save to new file
        print(f"Writing to {OUTPUT_FILENAME}...")
        with open(OUTPUT_FILENAME, 'w', encoding='utf-8') as f:
            json.dump(fixed_data, f, indent=2, ensure_ascii=False)

        print("Success! IDs added.")

    except json.JSONDecodeError:
        print("Error: The file is not valid JSON.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    main()
