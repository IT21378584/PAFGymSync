import React, { useState } from "react";
import { Card, Carousel, Button, Row, Col, Typography, Modal, Space } from "antd";
import { useSnapshot } from "valtio";
import { UploadOutlined } from "@ant-design/icons";
import state from "../../Utils/Store";
import { 
  EditOutlined, 
  DeleteOutlined, 
  ExpandOutlined,
  ShareAltOutlined,
  InfoCircleOutlined, 
  HeartOutlined,
  HeartFilled,
  MessageOutlined
} from "@ant-design/icons";
import SkillShareService from "../../Services/SkillShareService";

const { Title, Text, Paragraph } = Typography;

// Theme colors
// Modern color scheme
const themeColors = {
    primary: "#E63946", // Red as primary
    secondary: "#F87171", // Light red for secondary
    accent: "#FF9F1C", // Orange accent for energy/fitness vibe
    background: "#FFF5F5", // Very light red background
    surface: "#FFEBEB", // Light red surface
    cardBg: "#FFFFFF", // White background
    textPrimary: "#333333", // Dark gray for text
    textSecondary: "#666666", // Medium gray for secondary text
    border: "#FECACA", // Light red border
    hover: "#C81E2B", // Deeper red for hover
    danger: "#991B1B", // Dark red for warnings
    success: "#16A34A", // Green for success (kept for contrast)
    gradient: "linear-gradient(135deg, #E63946 0%, #F87171 100%)", // Red gradient
  }
  
  const SkillShareCard = ({ plan }) => {
    const snap = useSnapshot(state);
    const [deleteLoading, setIsDeleteLoading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewMedia, setPreviewMedia] = useState({ url: '', type: 'image' });
    const [liked, setLiked] = useState(false);
    
    const deletePlan = async () => {
      try {
        setIsDeleteLoading(true);
        await SkillShareService.deleteSkillShare(plan.id);
        state.SkillShares = await SkillShareService.getAllSkillShares();
      } catch (error) {
        console.error("Error deleting skill sharing post:", error);
      } finally {
        setIsDeleteLoading(false);
      }
    };
    
    const handlePreview = (url, type) => {
      setPreviewMedia({ url, type });
      setPreviewVisible(true);
    };
    
    const renderMediaItem = (url, type, index) => {
      return type === "image" ? (
        <div key={index} className="media-container" onClick={() => handlePreview(url, type)}>
          <img
            src={url}
            alt={`Media ${index + 1}`}
            style={{ 
              width: "100%", 
              height: 300, 
              objectFit: "cover", 
              borderRadius: 8,
              cursor: "pointer" 
            }}
          />
          <div className="media-overlay">
            <ExpandOutlined style={{ fontSize: 24, color: "white" }} />
          </div>
          <style jsx>{`
            .media-container {
              position: relative;
              overflow: hidden;
            }
            .media-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 123, 255, 0.3);
              display: flex;
              justify-content: center;
              align-items: center;
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            .media-container:hover .media-overlay {
              opacity: 1;
            }
          `}</style>
        </div>
      ) : (
        <div key={index} className="media-container">
          <video
            src={url}
            controls
            style={{ 
              width: "100%", 
              height: 300, 
              objectFit: "cover", 
              borderRadius: 8 
            }}
          />
        </div>
      );
    };
  