
import { GoogleGenAI, Type } from "@google/genai";

// Khởi tạo AI sử dụng API_KEY từ môi trường (Vercel/Netlify sẽ tiêm vào đây)
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getThermalAnalysis = async (temp: number, refTemp: number, load: number) => {
  const deltaT = temp - refTemp;
  
  // Xác định mức độ nguy hiểm dựa trên Delta T (Quy trình nhiệt cơ bản)
  // Delta T > 15: Theo dõi, Delta T > 30: Nguy hiểm (tùy thuộc loại thiết bị)
  
  const prompt = `Phân tích tình trạng nhiệt độ thiết bị điện:
    Nhiệt độ đo được: ${temp}°C
    Nhiệt độ tham chiếu: ${refTemp}°C
    Độ chênh lệch Delta T: ${deltaT.toFixed(1)}°C
    Dòng điện phụ tải: ${load}A
    Dựa trên tiêu chuẩn vận hành lưới điện Việt Nam (EVN), hãy đưa ra kết luận cực kỳ ngắn gọn (Dưới 25 từ) về tình trạng thiết bị (Bình thường, Theo dõi, hoặc Nguy hiểm cấp bách).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Không có phản hồi từ AI.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Lỗi phân tích AI. Vui lòng kiểm tra lại cấu hình API Key.";
  }
};
