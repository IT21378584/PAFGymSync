import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Space, Typography, Divider, Card } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import MealPlanService from "../../Services/MealPlanService";
import { PlusOutlined, EditOutlined, CalendarOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
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

const CreateMealPlanModal = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Create Meal Plan data object
      const MealPlanData = {
        userId: snap.currentUser?.uid,
        planName: values.planName,
        description: values.description,
        goal: values.goal,
        routines: values.routines,
      };

      await MealPlanService.CreateMealPlanModal(MealPlanData);
      state.MealPlans = await MealPlanService.getAllMealPlans();
      
      // Success message
      message.success("Meal plan created successfully!");

      // Reset form and close modal
      form.resetFields();
      state.CreateMealPlanModalOpened = false;
    } catch (error) {
      console.error("Form validation failed:", error);
      
      // Error message
      message.error("Failed to create meal plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    state.CreateMealPlanModalOpened = false;
  };

  return (
    <Modal
      title={null}
      footer={null}
      visible={snap.CreateMealPlanModalOpened}
      onCancel={handleCancel}
      width={600}
      centered
      destroyOnClose
      bodyStyle={{ padding: "0" }}
      style={{ borderRadius: 16, overflow: "hidden" }}
    >
      <div style={{ 
        padding: "20px 24px", 
        background: themeColors.gradient,
        color: "white",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative circles for fitness theme */}
        <div style={{
          position: "absolute",
          right: -15,
          top: -15,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          zIndex: 1
        }} />
        
        <div style={{
          position: "absolute",
          right: 50,
          bottom: -25,
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          zIndex: 1
        }} />
        
        <Title level={4} style={{ margin: 0, color: "white", position: "relative", zIndex: 2 }}>
          <PlusOutlined style={{ marginRight: 8 }} />
          Create Nutrition Plan
        </Title>
      </div>

      <div style={{ padding: "24px 24px 0 24px", background: themeColors.background }}>
        <Text type="secondary" style={{ display: "block", marginBottom: 24, fontSize: "15px" }}>
          Design your personalized nutrition plan with workout routines to fuel your fitness goals and maximize results.
        </Text>
      </div>

      {/* Form container with scrolling */}
      <div style={{ 
        padding: "0 24px 24px 24px",
        maxHeight: '65vh',  // Limit height
        overflow: 'auto',   // Enable scrolling
        background: themeColors.background
      }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Card
            style={{ 
              marginBottom: 24, 
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(31, 216, 164, 0.1)",
              border: "none"
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Title level={5} style={{ marginTop: 0, display: "flex", alignItems: "center", color: themeColors.textPrimary }}>
              <EditOutlined style={{ marginRight: 8, color: themeColors.primary }} />
              Plan Details
            </Title>
            <Divider style={{ margin: "12px 0", borderColor: themeColors.border }} />

            <Form.Item
              name="planName"
              label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>Plan Name</span>}
              rules={[{ required: true, message: "Please add a plan name" }]}
            >
              <Input 
                placeholder="E.g., Muscle Building Plan, Weight Loss Nutrition" 
                style={{ borderRadius: 10, padding: "12px 16px", fontSize: "15px" }}
                size="large"
              />
            </Form.Item>
            
            <Form.Item
              name="description"
              label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>Description</span>}
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <Input.TextArea 
                placeholder="Describe your nutrition goals, dietary preferences, and any restrictions" 
                rows={3}
                style={{ borderRadius: 10, padding: "12px 16px", fontSize: "15px" }}
              />
            </Form.Item>
          </Card>

          <Card
            style={{ 
              marginBottom: 24, 
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(31, 216, 164, 0.1)",
              border: "none"
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Title level={5} style={{ marginTop: 0, display: "flex", alignItems: "center", color: themeColors.textPrimary }}>
              <InfoCircleOutlined style={{ marginRight: 8, color: themeColors.primary }} />
              Nutrition Information
            </Title>
            <Divider style={{ margin: "12px 0", borderColor: themeColors.border }} />
            
            <Form.Item
              name="goal"
              label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>Meal Details</span>}
              rules={[{ required: true, message: "Please enter meal details" }]}
            >
              <Input.TextArea 
                placeholder="List your daily macros, meal timing, calorie targets, and specific foods to include" 
                style={{ borderRadius: 10, padding: "12px 16px", fontSize: "15px" }}
                rows={3}
              />
            </Form.Item>
          </Card>

          <Card
            style={{ 
              marginBottom: 24, 
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(31, 216, 164, 0.1)",
              border: "none"
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Title level={5} style={{ marginTop: 0, display: "flex", alignItems: "center", color: themeColors.textPrimary }}>
              <CalendarOutlined style={{ marginRight: 8, color: themeColors.primary }} />
              Workout Schedule
            </Title>
            <Divider style={{ margin: "12px 0", borderColor: themeColors.border }} />
            
            <Form.Item
              name="routines"
              label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>Weekly Routine</span>}
              rules={[{ required: true, message: "Please enter workout schedule" }]}
            >
              <Input.TextArea 
                placeholder="E.g., Monday: HIIT & Protein-rich meals, Wednesday: Strength & Complex carbs, Friday: Yoga & Recovery nutrition" 
                rows={3}
                style={{ borderRadius: 10, padding: "12px 16px", fontSize: "15px" }}
              />
            </Form.Item>
          </Card>
          
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button 
                onClick={handleCancel}
                style={{ 
                  borderRadius: 10, 
                  borderColor: themeColors.border,
                  paddingLeft: 24,
                  paddingRight: 24,
                  height: 44,
                  fontSize: "15px"
                }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                style={{
                  background: themeColors.gradient,
                  borderColor: "transparent",
                  borderRadius: 10,
                  boxShadow: "0 4px 12px rgba(31, 216, 164, 0.25)",
                  height: 44,
                  paddingLeft: 24,
                  paddingRight: 24,
                  fontSize: "15px",
                  fontWeight: 500
                }}
                size="large"
              >
                {loading ? "Creating..." : "Create Nutrition Plan"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateMealPlanModal;