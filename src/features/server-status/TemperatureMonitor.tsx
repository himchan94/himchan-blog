"use client";
import React, { useEffect, useState } from "react";

type SensorData = {
  timestamp: string;
  sensors: Record<string, Record<string, string>>;
};

export default function TemperatureMonitor() {
  const [data, setData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let socket: WebSocket;

    try {
      socket = new WebSocket("wss://api.devhimchan.com/ws"); // it's ok ^^

      socket.onopen = () => {
        console.log("WebSocket 연결됨");
        setError(null);
      };

      socket.onmessage = (event) => {
        try {
          const parsed: SensorData = JSON.parse(event.data);
          setData(parsed);
        } catch (e) {
          console.error("Parsing error:", e);
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        setError("WebSocket 연결 오류가 발생했습니다.");
      };

      socket.onclose = () => {
        console.log("WebSocket 연결이 닫혔습니다.");
        setError("WebSocket 연결이 닫혔습니다.");
      };
    } catch (e) {
      console.error("WebSocket 생성 오류:", e);
      setError("WebSocket을 생성할 수 없습니다.");
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  if (error) return <div className='text-danger'>❌ {error}</div>;
  if (!data) return <div>📡 센서 데이터 수신 중...</div>;

  return (
    <div>
      <h2>
        🖥️ 서버 센서 상태 (최근 {new Date(data.timestamp).toLocaleTimeString()})
      </h2>
      {Object.entries(data.sensors).map(([deviceId, values], index) => {
        if (index > 9) return null;

        return (
          <div key={deviceId} className='flex gap-2'>
            <h4>{deviceId}</h4>
            <p>
              {Object.entries(values).map(([key, value]) => (
                <span key={key}>
                  {key}: {value}{" "}
                </span>
              ))}
            </p>
          </div>
        );
      })}
    </div>
  );
}
