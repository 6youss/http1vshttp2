import React from "react";
import { listToMatrix, pad } from "../utils";

const ROW_LENGTH = 9;

function Http2() {
  const [imagesUrls, setImages] = React.useState([]);
  const [loadingTimes, setLoadingTimes] = React.useState([]);

  const startTime = React.useRef(null);

  async function handleClick() {
    startTime.current = new Date().getTime();
    const urls = Array.from(Array(81).keys()).map((i) => {
      const row = Math.floor(i / ROW_LENGTH); // Integer division
      const column = i % ROW_LENGTH; // Reminder of the division of I by LineLenght
      const id = `${pad(row + 1, 1)}${pad(column + 1, 1)}`;
      return `https://localhost:443/api/images/${id}`;
    });
    setImages(listToMatrix(urls, 9));
  }

  const http2LoadingTime = Math.max(...loadingTimes.flat(2));

  return (
    <div className="App">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          handleClick();
        }}
      >
        Load with http2
      </button>
      <div>
        {imagesUrls.map((row, i) => {
          return (
            <div className="images-row" key={i}>
              {row.map((imgUrl, j) => {
                return (
                  <img
                    key={i + j}
                    src={imgUrl}
                    alt={"img-" + i + j}
                    onLoad={() => {
                      console.log("onload");
                      const loadingTime = new Date().getTime() - startTime.current;
                      setLoadingTimes((lt) => {
                        if (!lt[i]) {
                          lt[i] = [];
                        }
                        lt[i][j] = loadingTime;
                        return [...lt];
                      });
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      {http2LoadingTime > 0 && <p>Loading Time : {http2LoadingTime}</p>}
    </div>
  );
}

export default Http2;
