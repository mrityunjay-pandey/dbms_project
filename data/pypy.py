import requests

# Image URL to download
image_url = 'https://havells.com/lighting/led-panels/lhebhdp5iz1w012-c.html'

# Function to download the image
def download_image(url, save_path):
    response = requests.get(url)
    if response.status_code == 200:
        with open(save_path, 'wb') as f:
            f.write(response.content)
        print(f"Image downloaded: {save_path}")
    else:
        print(f"Failed to download image from {url}")

# Path to save the image
save_path = r'C:\Users\Raja Pandey\Desktop\DBMS_PROJECT\gls18i3fosec.jpg'
download_image(image_url, save_path)
