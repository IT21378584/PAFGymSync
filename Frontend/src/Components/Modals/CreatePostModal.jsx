import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message, Space, Typography } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import { UploadOutlined, FileImageOutlined, VideoCameraOutlined } from "@ant-design/icons";
import PostService from "../../Services/PostService";

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

const { Title, Text } = Typography;
const uploader = new UploadFileService();

const CreatePostModal = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [fileType, setFileType] = useState("image");
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const body = {
        ...values,
        mediaLink: image,
        userId: snap.currentUser?.uid,
        mediaType: fileType,
      };
      await PostService.createPost(body);
      state.posts = await PostService.getPosts();
      message.success("Post created successfully");
      state.createPostModalOpened = false;
      form.resetFields();
      setImage("");
    } catch (error) {
      console.error("Form validation failed:", error);
      message.error("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = async (info) => {
    if (info.file) {
      try {
        setImageUploading(true);
        const fileType = info.file.type.split("/")[0];
        setFileType(fileType);
        const url = await uploader.uploadFile(
          info.fileList[0].originFileObj,
          "posts"
        );
        setImage(url);
        form.setFieldsValue({ mediaLink: url });
        message.success(`${fileType} uploaded successfully`);
      } catch (error) {
        message.error("Upload failed. Please try again.");
        console.error("Upload error:", error);
      } finally {
        setImageUploading(false);
      }
    } else if (info.file.status === "removed") {
      setImage("");
      form.setFieldsValue({ mediaLink: "" });
    }
  };
  
  const handleCancel = () => {
    form.resetFields();
    setImage("");
    state.createPostModalOpened = false;
  };

  const MediaPreview = () => {
    if (!image) return null;
    
    if (fileType === "image") {
      return (
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <img
            src={image}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              borderRadius: 12, // More rounded corners
              boxShadow: "0 6px 16px rgba(31, 216, 164, 0.15)" // Brand-colored shadow
            }}
          />
        </div>
      );
    }
    
    if (fileType === "video") {
      return (
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <video
            controls
            src={image}
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              borderRadius: 12, // More rounded corners
              boxShadow: "0 6px 16px rgba(31, 216, 164, 0.15)" // Brand-colored shadow
            }}
          />
        </div>
      );
    }
    
    return null;
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <div 
            style={{ 
              width: 6, 
              height: 24, 
              backgroundColor: themeColors.primary, 
              borderRadius: 3, 
              marginRight: 12 
            }} 
          />
          <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
            Share Your Fitness Journey
          </Title>
        </div>
      }
      onCancel={handleCancel}
      footer={null}
      visible={state.createPostModalOpened}
      width={600}
      centered
      destroyOnClose
      bodyStyle={{ 
        padding: "24px", 
        backgroundColor: themeColors.background 
      }}
      style={{ 
        borderRadius: 16,
        overflow: "hidden" 
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="contentDescription"
          label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>What's your fitness update?</span>}
          rules={[
            { required: true, message: "Please share your fitness update" },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Share your workout, progress, or fitness tip with the GYMSYNC community..."
            style={{ 
              borderRadius: 12, 
              border: `1px solid ${themeColors.border}`,
              backgroundColor: themeColors.cardBg,
              padding: "12px 16px",
              fontSize: "15px"
            }}
          />
        </Form.Item>
        
        <Form.Item
          name="mediaLink"
          label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>Add Media</span>}
          rules={[{ required: true, message: "Please upload an image or video of your progress" }]}
        >
          <div style={{ 
            backgroundColor: themeColors.surface, 
            padding: "20px", 
            borderRadius: 12,
            border: `1px dashed ${themeColors.border}`,
            textAlign: "center"
          }}>
            <Upload
              accept="image/*,video/*"
              onChange={handleFileChange}
              showUploadList={false}
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button 
                icon={<UploadOutlined />}
                disabled={imageUploading}
                style={{
                  borderRadius: 10,
                  background: themeColors.gradient,
                  borderColor: "transparent",
                  color: "white",
                  height: "42px",
                  padding: "0 24px",
                  fontSize: "15px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(31, 216, 164, 0.25)"
                }}
              >
                {imageUploading ? "Uploading..." : "Upload Your Progress"}
              </Button>
            </Upload>
            <Text type="secondary" style={{ display: "block", marginTop: 12 }}>
              Show off your workout, progress photos, or fitness achievements
            </Text>
          </div>
        </Form.Item>
        
        {imageUploading && (
          <div style={{ 
            textAlign: "center", 
            margin: "16px 0", 
            padding: "12px", 
            backgroundColor: themeColors.surface, 
            borderRadius: 8 
          }}>
            <Text type="secondary">Uploading your fitness content...</Text>
          </div>
        )}
        
        <MediaPreview />
        
        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button 
              onClick={handleCancel}
              style={{
                borderRadius: 10,
                height: "40px",
                padding: "0 20px"
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={imageUploading || !image}
              style={{
                background: themeColors.gradient,
                borderColor: "transparent",
                borderRadius: 10,
                height: "40px",
                padding: "0 24px",
                fontWeight: 500,
                boxShadow: "0 4px 12px rgba(31, 216, 164, 0.25)"
              }}
            >
              {loading ? "Sharing..." : "Share Post"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePostModal;