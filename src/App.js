import React, { useState } from "react";
import axios from "axios";
import styles from './App.module.css';

function App() {
  const [channelUrl, setChannelUrl] = useState("");
  const [numOfVideos, setNumOfVideos] = useState(0);
  const [videos, setVideos] = useState([]);

  const API_KEY = "AIzaSyCBm9FAFoM3nU_DKseurS7qId4ySsEncHM";

  const handleSubmit = async (event) => {
      event.preventDefault();

      try {
        const channelId = channelUrl.match(/youtube\.com\/(?:user|channel)\/([^/?]+)/i)[1];
    
        const videoResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${numOfVideos}`
        );
        const videos = videoResponse.data.items.map((item) => ({
          title: item.snippet.title,
          description: item.snippet.description,
          datePublished: item.snippet.publishedAt.slice(0, 10),
        }));
        setVideos(videos);
      } catch (error) {
        console.error(error);
      }
    }
  
  const handleChange = (event) => {
    if (event.target.name === "channelUrl") {
      setChannelUrl(event.target.value);
    } else if (event.target.name === "numOfVideos") {
      setNumOfVideos(event.target.value);
    }
  }

  const handleDownload = () => {
    const data = videos.map((video, index) => `${index + 1}) ${video.title}\n${video.datePublished}\n${video.description}\n\n`);
    const filename = `${channelUrl}_videos.txt`;
    const file = new Blob(data, { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, 0);
  };  

  return (
    <div className="App">
    <h1 className={styles.header}>
      <p className={styles.headerName}>Парсинг данных с YouTube`а</p>
      <button className={styles.btnDownload} type="button" onClick={handleDownload}>💾</button>
    </h1>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
            <input className={styles.typeTitle} type="text" name="channelUrl" value={channelUrl} onChange={handleChange} placeholder="Введите ссылку на YouTube канал" required />
            <input className={styles.typeNumber} type="number" min="1" max="50" name="numOfVideos" value={numOfVideos} onChange={handleChange} placeholder="Количество видео (до 50 вариантов)" required />
          <button className={styles.btn} type="submit">Поиск</button>
        </form>
      </div>

      <table>
      <thead>
        <tr>
          <th className={styles.number}>#</th>
          <th className={styles.title}>Название</th>
          <th className={styles.date}>Дата публикации</th>
          <th className={styles.description}>Описание видео</th>
        </tr>
      </thead>
      <tbody>
        {videos.map((video, index) => (
          <tr key={video.title}>
            <td>{index + 1}</td>
            <td>{video.title}</td>
            <td>{video.datePublished}</td>
            <td>{video.description}</td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
}

export default App;
