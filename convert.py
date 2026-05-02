from PIL import Image

try:
    img = Image.open('/home/hassan/insightnexus/demo_walkthrough.webp')
    img.info.pop('background', None)
    img.save('/home/hassan/insightnexus/demo_walkthrough.gif', 'gif', save_all=True, optimize=False)
    print("Conversion successful!")
except Exception as e:
    print(f"Error: {e}")
