
import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer'; // NEW
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { ProductDetail } from './pages/ProductDetail';
import { PostAd } from './pages/PostAd';
import { PostRentalAd } from './pages/PostRentalAd'; 
import { StoreProfile } from './pages/StoreProfile';
import { CreateStore } from './pages/CreateStore';
import { BecomePro } from './pages/BecomePro';
import { ImportRequest } from './pages/ImportRequest';
import { ProDashboard } from './pages/ProDashboard';
import { ProPlans } from './pages/ProPlans';
import { ProEntry } from './pages/ProEntry';
import { ImportEntry } from './pages/ImportEntry';
import { ImportDiscovery } from './pages/ImportDiscovery';
import { BookingCheckout } from './pages/BookingCheckout';
import { AdminFinance } from './pages/AdminFinance';
// PARTNER MODULE
import { FindPartner } from './pages/FindPartner';
import { PartnerEntry } from './pages/PartnerEntry';
import { PartnerOnboarding } from './pages/PartnerOnboarding';
import { PartnerPlans } from './pages/PartnerPlans';
import { PartnerDashboard } from './pages/PartnerDashboard';
import { Cart } from './pages/Cart';
import { OrderSuccess } from './pages/OrderSuccess'; // NEW

// Auth Imports
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext'; 
import { PaymentProvider } from './context/PaymentContext';
import { PartnerProvider } from './context/PartnerContext'; // NEW
import { CartProvider } from './context/CartContext'; // NEW
import { ListingsProvider } from './context/ListingsContext'; // NEW
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Unauthorized } from './pages/Unauthorized';
// Lazy import fix for Account
import { Account } from './pages/Account';

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </>
  );
};

const FullScreenLayout = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <PaymentProvider>
            <PartnerProvider>
              <ListingsProvider>
                <CartProvider>
                  <HashRouter>
                    <Routes>
                      {/* Public Routes with Header/Nav */}
                      <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="search" element={<Search />} />
                        <Route path="import" element={<ImportDiscovery />} />
                        
                        {/* Cart & Checkout Routes */}
                        <Route path="cart" element={<Cart />} />
                        <Route path="order-success" element={<OrderSuccess />} />

                        {/* Partner Module Public Routes */}
                        <Route path="find-partner" element={<FindPartner />} />
                        
                        <Route path="listing/:id" element={<ProductDetail />} />
                        <Route path="store/:id" element={<StoreProfile />} />
                        
                        {/* Protected User Routes */}
                        <Route path="favorites" element={
                          <ProtectedRoute>
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Vos favoris (à venir)</div>
                          </ProtectedRoute>
                        } />
                        <Route path="account" element={
                          <ProtectedRoute>
                            <Account /> 
                          </ProtectedRoute>
                        } />
                      </Route>

                      {/* Smart Router Routes */}
                      <Route path="pro-entry" element={<ProEntry />} />
                      <Route path="import-entry" element={<ImportEntry />} />

                      {/* Full Screen Routes */}
                      <Route element={<FullScreenLayout />}>
                        {/* Auth Routes - ALWAYS PUBLIC */}
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="unauthorized" element={<Unauthorized />} />

                        {/* Public Pro Information */}
                        <Route path="pro-plans" element={<ProPlans />} />
                        
                        {/* Partner Landing */}
                        <Route path="partner-entry" element={<PartnerEntry />} />
                        
                        {/* Partner Protected Routes */}
                        <Route path="partner-onboarding" element={
                          <ProtectedRoute>
                            <PartnerOnboarding />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="partner-plans" element={
                          <ProtectedRoute>
                            <PartnerPlans />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="partner-dashboard" element={
                          <ProtectedRoute>
                            <PartnerDashboard />
                          </ProtectedRoute>
                        } />

                        {/* Protected Routes */}
                        <Route path="post" element={
                          <ProtectedRoute>
                            <PostAd />
                          </ProtectedRoute>
                        } />

                        {/* --- MANDATORY PRO ROUTES (STEP 5) --- */}
                        <Route path="pro/post-ad" element={
                          <ProtectedRoute requiredRole="pro">
                            <PostAd />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="pro/plans" element={
                          <ProPlans />
                        } />

                        {/* Pro Dashboard Routes (Handled by ProDashboard component logic) */}
                        <Route path="pro-dashboard" element={<ProtectedRoute requiredRole="pro"><ProDashboard /></ProtectedRoute>} />
                        <Route path="pro/dashboard" element={<ProtectedRoute requiredRole="pro"><ProDashboard /></ProtectedRoute>} />
                        <Route path="pro/messages" element={<ProtectedRoute requiredRole="pro"><ProDashboard /></ProtectedRoute>} />
                        <Route path="pro/statistiques" element={<ProtectedRoute requiredRole="pro"><ProDashboard /></ProtectedRoute>} />
                        <Route path="pro/import-csv" element={<ProtectedRoute requiredRole="pro"><ProDashboard /></ProtectedRoute>} />
                        <Route path="pro/annonces" element={<ProtectedRoute requiredRole="pro"><ProDashboard /></ProtectedRoute>} />
                        <Route path="pro/annonces/:id/edit" element={<ProtectedRoute requiredRole="pro"><ProDashboard /></ProtectedRoute>} />

                        {/* Pro Rental Form */}
                        <Route path="post-rental" element={
                          <ProtectedRoute requiredRole="pro">
                            <PostRentalAd />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="import-request" element={
                          <ProtectedRoute>
                            <ImportRequest />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="create-store" element={
                          <ProtectedRoute>
                            <CreateStore />
                          </ProtectedRoute>
                        } />

                        <Route path="become-pro" element={
                          <ProtectedRoute>
                            <BecomePro />
                          </ProtectedRoute>
                        } />

                        {/* Booking Flow */}
                        <Route path="booking/checkout" element={
                          <ProtectedRoute>
                            <BookingCheckout />
                          </ProtectedRoute>
                        } />

                        {/* ADMIN FINANCE (Simulated Protection, ideally for 'admin' role) */}
                        <Route path="admin/finance" element={
                          <AdminFinance />
                        } />
                      </Route>
                    </Routes>
                  </HashRouter>
                </CartProvider>
              </ListingsProvider>
            </PartnerProvider>
          </PaymentProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
