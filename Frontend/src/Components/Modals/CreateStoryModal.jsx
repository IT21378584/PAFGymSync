import React, { useState } from "react";
import {
  Modal,
  Upload,
  Input,
  Button,
  DatePicker,
  message,
  Select,
  Form,
  Slider,
  Typography,
  Card,
  Divider,
  Row,
  Col,
  Tag,
  Tooltip
} from "antd";
import { 
  UploadOutlined, 
  ClockCircleOutlined, 
  FireOutlined,
  CalendarOutlined,
  EditOutlined,
  TagOutlined,
  ExperimentOutlined,
  BulbOutlined,
  PictureOutlined
} from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import StoryService from "../../Services/StoryService";
import moment from "moment";

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
const uploader = new UploadFileService();
const { Option } = Select;
const { Text, Title } = Typography;

const CreateStoryModal = () => {
  const snap = useSnapshot(state);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timestamp: null,
    exerciseType: "",
    timeDuration: 30,
    intensity: "",
    image: "",
    category: "Beginner"
  });

  // Duration markers for slider
  const durationMarks = {
    0: '0',
    30: '30',
    60: '60',
    90: '90',
    120: '120'
  };

  // Function to get intensity color based on value
  const getIntensityColor = (intensity) => {
    switch(intensity) {
      case "No Efforts": return '#32D583';
      case "Mid Efforts": return '#54B2FF';
      case "Moderate Efforts": return '#FDB022';
      case "Severe Efforts": return '#F97066';
      case "Maximal Efforts": return '#9E77ED';
      default: return themeColors.textSecondary;
    }
  };

  const handleCreateWorkoutStory = async () => {
    try {
      setLoading(true);
      const body = {
        ...formData,
        image: uploadedImage,
        userId: snap.currentUser?.uid,
      };
      
      await StoryService.createWorkoutStory(body);
      state.storyCards = await StoryService.getAllWorkoutStories();
      message.success("Learning Plan created successfully");
      
      // Reset form and modal
      form.resetFields();
      setUploadedImage(null);
      state.createWorkoutStatusModalOpened = false;
    } catch (error) {
      message.error("Error creating Learning Plan");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      try {
        const url = await uploader.uploadFile(
          info.fileList[0].originFileObj,
          "workoutStories"
        );
        setUploadedImage(url);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      timestamp: date,
    });
  };

  const handleIntensityChange = (value) => {
    setFormData({
      ...formData,
      intensity: value,
    });
  };

  const handleCategoryChange = (value) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 4,
            height: 30,
            background: themeColors.primary,
            marginRight: 12,
            borderRadius: 2
          }} />
          <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
            Create Learning Plan
          </Title>
        </div>
      }
      open={snap.createWorkoutStatusModalOpened}
      onCancel={() => {
        state.createWorkoutStatusModalOpened = false;
      }}
      width={800}
      bodyStyle={{ 
        padding: '16px', 
        backgroundColor: themeColors.background,
        borderRadius: '16px'
      }}
      footer={null}
      centered
    >
      <Form 
        form={form} 
        layout="vertical"
      >
        <Row gutter={24}>
          {/* Left column - Core details */}
          <Col span={14}>
            <Card 
              bordered={false} 
              style={{ 
                background: themeColors.cardBg,
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(127, 86, 217, 0.1)',
                height: '100%'
              }}
            >
              <Title level={5} style={{ 
                color: themeColors.primary, 
                marginBottom: '20px',
                position: 'relative',
                paddingBottom: '10px',
              }}>
                Plan Details
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '40px',
                  height: '3px',
                  backgroundColor: themeColors.primary,
                  borderRadius: '2px'
                }}></div>
              </Title>

              <Form.Item 
                label={
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <EditOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                    Plan Title
                  </span>
                } 
                name="title" 
                rules={[{ required: true, message: 'Please input a title' }]}
              >
                <Input
                  placeholder="Enter your learning plan title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  style={{ borderRadius: '8px', borderColor: themeColors.border }}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    label={
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <TagOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                        Learning Type
                      </span>
                    } 
                    name="exerciseType"
                  >
                    <Input
                      placeholder="e.g. Programming, Language"
                      name="exerciseType"
                      value={formData.exerciseType}
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', borderColor: themeColors.border }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item 
                    label={
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                        Start Date
                      </span>
                    } 
                    name="timestamp"
                  >
                    <DatePicker
                      placeholder="Select date"
                      style={{ width: "100%", borderRadius: '8px', borderColor: themeColors.border }}
                      value={formData.timestamp}
                      onChange={handleDateChange}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item 
                label={
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <BulbOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                    Description
                  </span>
                } 
                name="description"
              >
                <Input.TextArea
                  placeholder="Add some details about this learning plan..."
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  style={{ borderRadius: '8px', borderColor: themeColors.border }}
                />
              </Form.Item>

              <Form.Item 
                label={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <ClockCircleOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                      Study Time
                    </span>
                    <Text 
                      strong 
                      style={{ 
                        color: formData.timeDuration > 60 ? '#f5222d' : formData.timeDuration > 30 ? '#faad14' : '#32D583',
                      }}
                    >
                      {formData.timeDuration} minutes
                    </Text>
                  </div>
                }
                name="timeDuration"
              >
                <div style={{ 
                  backgroundColor: themeColors.surface,
                  padding: '16px 16px 0',
                  borderRadius: '12px',
                  border: `1px solid ${themeColors.border}`,
                }}>
                  <Slider
                    min={0}
                    max={120}
                    step={5}
                    value={formData.timeDuration}
                    marks={durationMarks}
                    tooltip={{ formatter: value => `${value} min` }}
                    trackStyle={{ backgroundColor: themeColors.primary }}
                    handleStyle={{ borderColor: themeColors.primary }}
                    onChange={(value) => {
                      setFormData({
                        ...formData,
                        timeDuration: value,
                      });
                    }}
                  />
                </div>
              </Form.Item>
            </Card>
          </Col>

          {/* Right column - Image and settings */}
          <Col span={10}>
            <Card 
              bordered={false} 
              style={{ 
                background: themeColors.cardBg,
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(127, 86, 217, 0.1)',
                marginBottom: '16px'
              }}
            >
              <Title level={5} style={{ 
                color: themeColors.primary, 
                marginBottom: '20px',
                position: 'relative',
                paddingBottom: '10px',
              }}>
                Plan Image
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '40px',
                  height: '3px',
                  backgroundColor: themeColors.primary,
                  borderRadius: '2px'
                }}></div>
              </Title>

              {uploadedImage ? (
                <div style={{ 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(127, 86, 217, 0.15)',
                  marginBottom: '16px',
                  position: 'relative'
                }}>
                  <img
                    style={{ 
                      width: "100%", 
                      height: "160px",
                      objectFit: 'cover'
                    }}
                    src={uploadedImage}
                    alt="Learning Plan"
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '30px 16px 16px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <Upload
                      accept="image/*"
                      onChange={handleFileChange}
                      showUploadList={false}
                      beforeUpload={() => false}
                    >
                      <Button 
                        icon={<UploadOutlined />} 
                        type="primary"
                        ghost
                        style={{ 
                          borderColor: 'white', 
                          color: 'white',
                          borderRadius: '8px'
                        }}
                      >
                        Change Image
                      </Button>
                    </Upload>
                  </div>
                </div>
              ) : (
                <div style={{
                  margin: '10px 0',
                  border: `2px dashed ${themeColors.border}`,
                  borderRadius: '12px',
                  padding: '30px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: themeColors.surface
                }}>
                  {imageUploading ? (
                    <Text>Uploading image...</Text>
                  ) : (
                    <Upload
                      accept="image/*"
                      onChange={handleFileChange}
                      showUploadList={false}
                      beforeUpload={() => false}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <PictureOutlined style={{ fontSize: '24px', color: themeColors.primary, marginBottom: '8px' }} />
                        <div>
                          <Text style={{ fontSize: '14px', color: themeColors.textSecondary }}>Upload plan image</Text>
                        </div>
                        <Button
                          type="primary"
                          style={{
                            marginTop: '12px',
                            borderRadius: '8px',
                            background: themeColors.gradient,
                            border: 'none'
                          }}
                        >
                          Browse Images
                        </Button>
                      </div>
                    </Upload>
                  )}
                </div>
              )}
            </Card>

            <Card 
              bordered={false} 
              style={{ 
                background: themeColors.cardBg,
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(127, 86, 217, 0.1)'
              }}
            >
              <Title level={5} style={{ 
                color: themeColors.primary, 
                marginBottom: '20px',
                position: 'relative',
                paddingBottom: '10px',
              }}>
                Plan Settings
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '40px',
                  height: '3px',
                  backgroundColor: themeColors.primary,
                  borderRadius: '2px'
                }}></div>
              </Title>

              <Form.Item 
                label={
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <ExperimentOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                    Category
                  </span>
                } 
                name="category"
              >
                <Select
                  placeholder="Select category"
                  style={{ width: "100%", borderRadius: '8px' }}
                  value={formData.category}
                  onChange={handleCategoryChange}
                  dropdownStyle={{ borderRadius: '8px' }}
                >
                  <Option value="Beginner">
                    <Tag color="green">Beginner</Tag>
                  </Option>
                  <Option value="Intermediate">
                    <Tag color="blue">Intermediate</Tag>
                  </Option>
                  <Option value="Advanced">
                    <Tag color="purple">Advanced</Tag>
                  </Option>
                  <Option value="Expert">
                    <Tag color="red">Expert</Tag>
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item 
                label={
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <FireOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                    Difficulty Level
                  </span>
                } 
                name="intensity"
              >
                <div style={{ marginBottom: '16px' }}>
                  <Row gutter={[8, 8]}>
                    {["No Efforts", "Mid Efforts", "Moderate Efforts", "Severe Efforts", "Maximal Efforts"].map((level) => (
                      <Col key={level} span={12}>
                        <Card
                          onClick={() => handleIntensityChange(level)}
                          style={{ 
                            cursor: 'pointer',
                            borderRadius: '8px',
                            borderColor: formData.intensity === level ? getIntensityColor(level) : themeColors.border,
                            background: formData.intensity === level ? `${getIntensityColor(level)}10` : themeColors.cardBg,
                            transition: 'all 0.2s ease',
                          }}
                          bodyStyle={{ padding: '8px' }}
                          size="small"
                        >
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <Text style={{ 
                              fontSize: '12px',
                              color: formData.intensity === level ? getIntensityColor(level) : themeColors.textSecondary
                            }}>
                              {level}
                            </Text>
                            <FireOutlined style={{ 
                              fontSize: '14px', 
                              color: getIntensityColor(level)
                            }} />
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          marginTop: '20px',
          gap: '12px'
        }}>
          <Button 
            onClick={() => (state.createWorkoutStatusModalOpened = false)}
            style={{
              borderRadius: '8px',
              borderColor: themeColors.border,
              color: themeColors.textSecondary
            }}
          >
            Cancel
          </Button>
          
          <Button
            loading={loading}
            type="primary"
            onClick={handleCreateWorkoutStory}
            style={{
              background: themeColors.gradient,
              borderColor: themeColors.primary,
              borderRadius: '8px',
              boxShadow: "0 4px 12px rgba(127, 86, 217, 0.2)",
              minWidth: '120px'
            }}
          >
            Create Plan
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateStoryModal;