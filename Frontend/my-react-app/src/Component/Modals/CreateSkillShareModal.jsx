import React, { useState } from "react";
import { Modal, Form, Input, Button, Select, Row, Col, Typography } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import SkillShareService from "../../Services/SkillShareService";
import UploadFileService from "../../Services/UploadFileService";
import { UploadOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title } = Typography;
const uploader = new UploadFileService();

// Theme colors from the first component
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

const CreateSkillShareModal = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Call the service to create the Skill Share
      await SkillShareService.createSkillShare({
        ...values,
        userId: snap.currentUser?.uid,
        mediaUrls: mediaFiles.map(file => file.url),
        mediaTypes: mediaFiles.map(file => file.type)
      });
      state.SkillShares = await SkillShareService.getAllSkillShares();
      
      // Reset the form and close the modal on success
      form.resetFields();
      setMediaFiles([]);
      state.createSkillShareOpened = false;
    } catch (error) {
      console.error("Error creating Skill Share:", error);
    } finally {
      setLoading(false);
    }
  };
  // Use a custom file input instead of Ant's Upload component to avoid duplication issues
  const handleFileInputChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Check if adding these files would exceed the limit
    if (mediaFiles.length + files.length > 3) {
      alert(`You can only upload up to 3 files in total. You've selected ${files.length} files but can only add ${3 - mediaFiles.length} more.`);
      // Reset the file input
      e.target.value = null;
      return;
    }
    
    setUploadingMedia(true);
    
    try {
      // Process all files in parallel
      const uploadPromises = files.map(async (file) => {
        const fileType = file.type.split("/")[0];
        
        // Validate video duration if it's a video
        if (fileType === "video") {
          const isValid = await validateVideoDuration(file);
          if (!isValid) {
            alert(`Video "${file.name}" must be 30 seconds or less`);
            return null;
          }
        }
        
        const url = await uploader.uploadFile(file, "posts");
        
        return {
          uid: Date.now() + Math.random().toString(36).substring(2, 9),
          url: url,
          type: fileType,
          name: file.name
        };
      });
      
      const results = await Promise.all(uploadPromises);
      const validResults = results.filter(result => result !== null);
      
      setMediaFiles(prev => [...prev, ...validResults]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploadingMedia(false);
      // Reset the file input
      e.target.value = null;
    }
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration <= 30);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const removeMediaFile = (uid) => {
    setMediaFiles(prev => prev.filter(file => file.uid !== uid));
  };

  const renderMediaPreview = () => {
    return (
      <>
        <p style={{ color: themeColors.textPrimary }}>Media Files ({mediaFiles.length}/3):</p>
        <Row gutter={[16, 16]}>
          {mediaFiles.map(file => (
            <Col key={file.uid} span={8}>
              <div style={{ position: 'relative' }}>
                {file.type === 'image' ? (
                  <img 
                    src={file.url} 
                    alt={file.name}
                    style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }}
                  />
                ) : (
                  <video 
                    src={file.url} 
                    controls
                    style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }}
                  />
                )}
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => removeMediaFile(file.uid)}
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0,
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 8
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </>
    );
  };
