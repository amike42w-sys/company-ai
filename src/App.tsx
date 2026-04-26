import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import HomePage from './components/Home/HomePage'
import PublicChat from './components/Chat/PublicChat'
import AnalysisPage from './components/Analysis/AnalysisPage'
import CertificateUpload from './components/_old_version/Certificates/CertificateUpload'
import CustomerManager from './components/Customer/CustomerManager'
import EmployeeManager from './components/Employee/EmployeeManager'
import QuotationManager from './components/Quotation/QuotationManager'
import SupplierManager from './components/Supplier/SupplierManager'
import SupplierCertificateManager from './components/Supplier/SupplierCertificateManager'
import ChatMonitor from './components/Admin/ChatMonitor'
import Login from './components/Auth/Login'
import ProfilePage from './components/Auth/ProfilePage'
import ProductDetail from './pages/ProductDetail'
import CategoryProjects from './pages/CategoryProjects'
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 登录页面 - 独立布局 */}
        <Route path="/login" element={<Login />} />
        
        {/* 主布局 */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="public-chat" element={<PublicChat />} />
          <Route path="category/:categoryId" element={<CategoryProjects />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route 
            path="analysis" 
            element={
              <ProtectedRoute requiredRoles={['internal']}>
                <AnalysisPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="suppliers" 
            element={
              <ProtectedRoute requiredRoles={['internal', 'certificate_admin', 'certificate_viewer']}>
                <SupplierManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="supplier-certificates" 
            element={
              <ProtectedRoute requiredRoles={['internal', 'certificate_admin', 'certificate_viewer']}>
                <SupplierCertificateManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="certificates" 
            element={
              <ProtectedRoute requiredRoles={['internal', 'certificate_admin', 'certificate_viewer']}>
                <CertificateUpload />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="customers" 
            element={
              <ProtectedRoute requiredRoles={['internal']}>
                <CustomerManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="employees" 
            element={
              <ProtectedRoute requiredRoles={['internal']}>
                <EmployeeManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="quotations" 
            element={
              <ProtectedRoute requiredRoles={['internal']}>
                <QuotationManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute requiredRoles={['external', 'internal']}>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="chat-monitor" 
            element={
              <ProtectedRoute requiredRoles={['internal']}>
                <ChatMonitor />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* 404 重定向到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
