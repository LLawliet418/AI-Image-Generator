import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_img1 from '../Assets/default_img1.png';
import default_img2 from '../Assets/default_img2.png';
import default_img3 from '../Assets/default_img3.png';
import download_icon from '../Assets/download_icon.png';

const ImageGenerator = () => {
  const [imgUrls, setImgUrls] = useState([default_img1, default_img2, default_img3]);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const downloadImage = (src) => {
  const a = document.createElement('a');
  a.href = src;
  a.download = 'downloaded_file.jpg'; 
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

  const generateImages = async () => {
    if (inputRef.current.value === "") {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer #API_KEY#",
          "User-Agent": "Chrome",
        },
        body: JSON.stringify({
          prompt: `${inputRef.current.value}`,
          n: 3,
          size: "512x512",
        }),
      });

      const data = await response.json();
      const urls = data.data.map(image => image.url);
      setImgUrls(urls);
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className='ai_image_generator'>
      <div className='header'><span className='highlight'>SMALL-E</span> Image Generator</div>
      <div className='img_container'>
        <div className='img_loader'>
          {imgUrls.map((url, index) => (
            <div key={index} className='image'>
              <img src={url} alt={`Generated ${index + 1}`} />
              <button className="download_btn" onClick={() => downloadImage(url)}><img src={download_icon} alt='download' className='download_icon'/></button>
            </div>
          ))}
        </div>
        <div className='loading'>
            <div className='loading_bar_container'>
                <div className={loading ? "loading_bar_full" : "loading_bar"}></div>
            </div>          
            <div className={loading ? "loading_text" : "display_none"}>Loading...</div>
        </div>
      </div>
      <div className='search_box'>
        <input type="text" ref={inputRef} className='search_input' placeholder='Guinea pigs in a rocket in space' />
        <div className='generate_btn' onClick={generateImages}>Generate</div>
      </div>
    </div>
  )
}

export default ImageGenerator;
