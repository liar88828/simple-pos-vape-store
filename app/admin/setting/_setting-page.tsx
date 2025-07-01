// import React, { useState } from 'react';
// import { Bell, ChevronRight, CreditCard, Eye, EyeOff, Package, Save, Shield, Store, Truck, Upload } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';
//
// export default function OnlineShopSettings() {
//     const [ activeSection, setActiveSection ] = useState('store');
//     const [ saved, setSaved ] = useState(false);
//     const [ showApiKey, setShowApiKey ] = useState(false);
//
//     const [ settings, setSettings ] = useState({
//         store: {
//             name: 'My Online Store',
//             description: 'Premium quality products for modern lifestyle',
//             logo: null,
//             address: '123 Commerce Street, Business District',
//             phone: '+1 (555) 123-4567',
//             email: 'contact@mystore.com',
//             website: 'https://mystore.com',
//             currency: 'USD',
//             timezone: 'America/New_York'
//         },
//         payment: {
//             stripe: {
//                 enabled: true,
//                 publicKey: 'pk_test_...',
//                 secretKey: 'sk_test_...'
//             },
//             paypal: {
//                 enabled: true,
//                 clientId: 'your-paypal-client-id'
//             },
//             cod: {
//                 enabled: true,
//                 fee: 5.00
//             },
//             bankTransfer: {
//                 enabled: false,
//                 accountNumber: '',
//                 routingNumber: ''
//             }
//         },
//         shipping: {
//             freeShippingThreshold: 50,
//             domesticRates: [
//                 { name: 'Standard', price: 5.99, days: '5-7' },
//                 { name: 'Express', price: 12.99, days: '2-3' }
//             ],
//             internationalShipping: true,
//             internationalRate: 25.00,
//             handlingFee: 2.50
//         },
//         notifications: {
//             orderConfirmation: true,
//             lowStock: true,
//             newCustomer: true,
//             dailyReport: false,
//             weeklyReport: true
//         },
//         security: {
//             twoFactorAuth: false,
//             loginNotifications: true,
//             apiAccess: true,
//             webhookUrl: ''
//         },
//         inventory: {
//             lowStockThreshold: 10,
//             autoReorder: false,
//             trackInventory: true,
//             allowBackorders: false
//         }
//     });
//
//     const sections = [
//         { id: 'store', label: 'Store Information', icon: Store },
//         { id: 'payment', label: 'Payment Methods', icon: CreditCard },
//         { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
//         { id: 'inventory', label: 'Inventory Management', icon: Package },
//         { id: 'notifications', label: 'Notifications', icon: Bell },
//         { id: 'security', label: 'Security & API', icon: Shield }
//     ];
//
//     const updateSetting = (section, key, value) => {
//         setSettings(prev => ({
//             ...prev,
//             [section]: {
//                 ...prev[section],
//                 [key]: value
//             }
//         }));
//     };
//
//     const updateNestedSetting = (section, subsection, key, value) => {
//         setSettings(prev => ({
//             ...prev,
//             [section]: {
//                 ...prev[section],
//                 [subsection]: {
//                     ...prev[section][subsection],
//                     [key]: value
//                 }
//             }
//         }));
//     };
//
//     const handleSave = () => {
//         setSaved(true);
//         setTimeout(() => setSaved(false), 3000);
//     };
//
//     const Switch = ({ checked, onChange, disabled = false }) => (
//         <button
//             onClick={ () => !disabled && onChange(!checked) }
//             className={ `relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
//                 checked ? 'bg-blue-600' : 'bg-gray-200'
//             } ${ disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer' }` }
//         >
//       <span
//           className={ `inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
//               checked ? 'translate-x-6' : 'translate-x-1'
//           }` }
//       />
//         </button>
//     );
//
//     const Input = ({ value, onChange, placeholder, type = "text", className = "" }) => (
//         <input
//             type={ type }
//             value={ value }
//             onChange={ (e) => onChange(e.target.value) }
//             placeholder={ placeholder }
//             className={ `px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${ className }` }
//         />
//     );
//
//     const Select = ({ value, onChange, options, className = "" }) => (
//         <select
//             value={ value }
//             onChange={ (e) => onChange(e.target.value) }
//             className={ `px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${ className }` }
//         >
//             { options.map(option => (
//                 <option key={ option.value } value={ option.value }>
//                     { option.label }
//                 </option>
//             )) }
//         </select>
//     );
//
//     const Textarea = ({ value, onChange, placeholder, className = "" }) => (
//         <textarea
//             value={ value }
//             onChange={ (e) => onChange(e.target.value) }
//             placeholder={ placeholder }
//             rows={ 3 }
//             className={ `px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${ className }` }
//         />
//     );
//
//     const renderStoreSection = () => (
//         <div className="space-y-6">
//             <div>
//                 <h3 className="text-lg font-semibold mb-4">Store Information</h3>
//                 <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
//                             <Input
//                                 value={ settings.store.name }
//                                 onChange={ (value) => updateSetting('store', 'name', value) }
//                                 placeholder="Enter store name"
//                                 className="w-full"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
//                             <Select
//                                 value={ settings.store.currency }
//                                 onChange={ (value) => updateSetting('store', 'currency', value) }
//                                 options={ [
//                                     { value: 'USD', label: 'USD - US Dollar' },
//                                     { value: 'EUR', label: 'EUR - Euro' },
//                                     { value: 'GBP', label: 'GBP - British Pound' },
//                                     { value: 'JPY', label: 'JPY - Japanese Yen' }
//                                 ] }
//                                 className="w-full"
//                             />
//                         </div>
//                     </div>
//
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
//                         <Textarea
//                             value={ settings.store.description }
//                             onChange={ (value) => updateSetting('store', 'description', value) }
//                             placeholder="Describe your store"
//                             className="w-full"
//                         />
//                     </div>
//
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
//                             <Input
//                                 value={ settings.store.phone }
//                                 onChange={ (value) => updateSetting('store', 'phone', value) }
//                                 placeholder="+1 (555) 123-4567"
//                                 className="w-full"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
//                             <Input
//                                 value={ settings.store.email }
//                                 onChange={ (value) => updateSetting('store', 'email', value) }
//                                 placeholder="contact@store.com"
//                                 type="email"
//                                 className="w-full"
//                             />
//                         </div>
//                     </div>
//
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
//                         <Input
//                             value={ settings.store.address }
//                             onChange={ (value) => updateSetting('store', 'address', value) }
//                             placeholder="123 Main Street, City, State"
//                             className="w-full"
//                         />
//                     </div>
//
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Store Logo</label>
//                         <div className="flex items-center space-x-4">
//                             <div
//                                 className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
//                                 <Upload className="w-6 h-6 text-gray-400"/>
//                             </div>
//                             <button
//                                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                                 Upload Logo
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
//
//     const renderPaymentSection = () => (
//         <div className="space-y-6">
//             <div>
//                 <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
//                 <div className="space-y-6">
//                     {/* Stripe */ }
//                     <div className="border border-gray-200 rounded-lg p-4">
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center space-x-3">
//                                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                                     <CreditCard className="w-5 h-5 text-blue-600"/>
//                                 </div>
//                                 <div>
//                                     <h4 className="font-medium">Stripe</h4>
//                                     <p className="text-sm text-gray-500">Credit cards, debit cards</p>
//                                 </div>
//                             </div>
//                             <Switch
//                                 checked={ settings.payment.stripe.enabled }
//                                 onChange={ (value) => updateNestedSetting('payment', 'stripe', 'enabled', value) }
//                             />
//                         </div>
//                         { settings.payment.stripe.enabled && (
//                             <div className="space-y-3">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Public Key</label>
//                                     <Input
//                                         value={ settings.payment.stripe.publicKey }
//                                         onChange={ (value) => updateNestedSetting('payment', 'stripe', 'publicKey', value) }
//                                         placeholder="pk_test_..."
//                                         className="w-full"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
//                                     <div className="relative">
//                                         <Input
//                                             value={ settings.payment.stripe.secretKey }
//                                             onChange={ (value) => updateNestedSetting('payment', 'stripe', 'secretKey', value) }
//                                             placeholder="sk_test_..."
//                                             type={ showApiKey ? "text" : "password" }
//                                             className="w-full pr-10"
//                                         />
//                                         <button
//                                             onClick={ () => setShowApiKey(!showApiKey) }
//                                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                         >
//                                             { showApiKey ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/> }
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ) }
//                     </div>
//
//                     {/* PayPal */ }
//                     <div className="border border-gray-200 rounded-lg p-4">
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center space-x-3">
//                                 <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
//                                     <CreditCard className="w-5 h-5 text-yellow-600"/>
//                                 </div>
//                                 <div>
//                                     <h4 className="font-medium">PayPal</h4>
//                                     <p className="text-sm text-gray-500">PayPal payments</p>
//                                 </div>
//                             </div>
//                             <Switch
//                                 checked={ settings.payment.paypal.enabled }
//                                 onChange={ (value) => updateNestedSetting('payment', 'paypal', 'enabled', value) }
//                             />
//                         </div>
//                         { settings.payment.paypal.enabled && (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
//                                 <Input
//                                     value={ settings.payment.paypal.clientId }
//                                     onChange={ (value) => updateNestedSetting('payment', 'paypal', 'clientId', value) }
//                                     placeholder="your-paypal-client-id"
//                                     className="w-full"
//                                 />
//                             </div>
//                         ) }
//                     </div>
//
//                     {/* Cash on Delivery */ }
//                     <div className="border border-gray-200 rounded-lg p-4">
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center space-x-3">
//                                 <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//                                     <Package className="w-5 h-5 text-green-600"/>
//                                 </div>
//                                 <div>
//                                     <h4 className="font-medium">Cash on Delivery</h4>
//                                     <p className="text-sm text-gray-500">Pay when you receive</p>
//                                 </div>
//                             </div>
//                             <Switch
//                                 checked={ settings.payment.cod.enabled }
//                                 onChange={ (value) => updateNestedSetting('payment', 'cod', 'enabled', value) }
//                             />
//                         </div>
//                         { settings.payment.cod.enabled && (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">COD Fee ($)</label>
//                                 <Input
//                                     value={ settings.payment.cod.fee }
//                                     onChange={ (value) => updateNestedSetting('payment', 'cod', 'fee', parseFloat(value) || 0) }
//                                     placeholder="5.00"
//                                     type="number"
//                                     step="0.01"
//                                     className="w-full"
//                                 />
//                             </div>
//                         ) }
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
//
//     const renderShippingSection = () => (
//         <div className="space-y-6">
//             <div>
//                 <h3 className="text-lg font-semibold mb-4">Shipping & Delivery</h3>
//                 <div className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold
//                                 ($)</label>
//                             <Input
//                                 value={ settings.shipping.freeShippingThreshold }
//                                 onChange={ (value) => updateSetting('shipping', 'freeShippingThreshold', parseFloat(value) || 0) }
//                                 placeholder="50.00"
//                                 type="number"
//                                 step="0.01"
//                                 className="w-full"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Handling Fee ($)</label>
//                             <Input
//                                 value={ settings.shipping.handlingFee }
//                                 onChange={ (value) => updateSetting('shipping', 'handlingFee', parseFloat(value) || 0) }
//                                 placeholder="2.50"
//                                 type="number"
//                                 step="0.01"
//                                 className="w-full"
//                             />
//                         </div>
//                     </div>
//
//                     <div>
//                         <h4 className="font-medium mb-3">Domestic Shipping Rates</h4>
//                         <div className="space-y-3">
//                             { settings.shipping.domesticRates.map((rate, index) => (
//                                 <div key={ index }
//                                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
//                                     <Input
//                                         value={ rate.name }
//                                         onChange={ (value) => {
//                                             const newRates = [ ...settings.shipping.domesticRates ];
//                                             newRates[index].name = value;
//                                             updateSetting('shipping', 'domesticRates', newRates);
//                                         } }
//                                         placeholder="Shipping method"
//                                         className="flex-1"
//                                     />
//                                     <Input
//                                         value={ rate.price }
//                                         onChange={ (value) => {
//                                             const newRates = [ ...settings.shipping.domesticRates ];
//                                             newRates[index].price = parseFloat(value) || 0;
//                                             updateSetting('shipping', 'domesticRates', newRates);
//                                         } }
//                                         placeholder="Price"
//                                         type="number"
//                                         step="0.01"
//                                         className="w-24"
//                                     />
//                                     <Input
//                                         value={ rate.days }
//                                         onChange={ (value) => {
//                                             const newRates = [ ...settings.shipping.domesticRates ];
//                                             newRates[index].days = value;
//                                             updateSetting('shipping', 'domesticRates', newRates);
//                                         } }
//                                         placeholder="Days"
//                                         className="w-20"
//                                     />
//                                 </div>
//                             )) }
//                         </div>
//                     </div>
//
//                     <div className="flex items-center justify-between py-3">
//                         <div>
//                             <p className="font-medium text-gray-900">International Shipping</p>
//                             <p className="text-sm text-gray-500">Enable shipping to international destinations</p>
//                         </div>
//                         <Switch
//                             checked={ settings.shipping.internationalShipping }
//                             onChange={ (value) => updateSetting('shipping', 'internationalShipping', value) }
//                         />
//                     </div>
//
//                     { settings.shipping.internationalShipping && (
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">International Rate
//                                 ($)</label>
//                             <Input
//                                 value={ settings.shipping.internationalRate }
//                                 onChange={ (value) => updateSetting('shipping', 'internationalRate', parseFloat(value) || 0) }
//                                 placeholder="25.00"
//                                 type="number"
//                                 step="0.01"
//                                 className="w-full"
//                             />
//                         </div>
//                     ) }
//                 </div>
//             </div>
//         </div>
//     );
//
//     const renderInventorySection = () => (
//         <div className="space-y-6">
//             <div>
//                 <h3 className="text-lg font-semibold mb-4">Inventory Management</h3>
//                 <div className="space-y-4">
//                     <div className="flex items-center justify-between py-3">
//                         <div>
//                             <p className="font-medium text-gray-900">Track Inventory</p>
//                             <p className="text-sm text-gray-500">Monitor stock levels for products</p>
//                         </div>
//                         <Switch
//                             checked={ settings.inventory.trackInventory }
//                             onChange={ (value) => updateSetting('inventory', 'trackInventory', value) }
//                         />
//                     </div>
//
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
//                         <Input
//                             value={ settings.inventory.lowStockThreshold }
//                             onChange={ (value) => updateSetting('inventory', 'lowStockThreshold', parseInt(value) || 0) }
//                             placeholder="10"
//                             type="number"
//                             className="w-full"
//                         />
//                         <p className="text-sm text-gray-500 mt-1">Get notified when stock falls below this number</p>
//                     </div>
//
//                     <div className="flex items-center justify-between py-3">
//                         <div>
//                             <p className="font-medium text-gray-900">Allow Backorders</p>
//                             <p className="text-sm text-gray-500">Allow customers to order out-of-stock items</p>
//                         </div>
//                         <Switch
//                             checked={ settings.inventory.allowBackorders }
//                             onChange={ (value) => updateSetting('inventory', 'allowBackorders', value) }
//                         />
//                     </div>
//
//                     <div className="flex items-center justify-between py-3">
//                         <div>
//                             <p className="font-medium text-gray-900">Auto Reorder</p>
//                             <p className="text-sm text-gray-500">Automatically reorder products when low stock</p>
//                         </div>
//                         <Switch
//                             checked={ settings.inventory.autoReorder }
//                             onChange={ (value) => updateSetting('inventory', 'autoReorder', value) }
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
//
//     const renderNotificationsSection = () => (
//         <div className="space-y-6">
//             <div>
//                 <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
//                 <div className="space-y-4">
//                     <div className="flex items-center justify-between py-3">
//                         <div>
//                             <p className="font-medium text-gray-900">Order Confirmations</p>
//                             <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
//                         </div>
//                         <Switch
//                             checked={ settings.notifications.orderConfirmation }
//                             onChange={ (value) => updateSetting('notifications', 'orderConfirmation', value) }
//                         />
//                     </div>
//
//                     <div className="flex items-center justify-between py-3">
//                         <div>
//                             <p className="font-medium text-gray-900">Low Stock Alerts</p>
//                             <p className="text-sm text-gray-500">Receive alerts when inventory is low</p>
//                         </div>
//                         <Switch
//                             checked={ settings.notifications.lowStock }
//                             onChange={ (value) => updateSetting('notifications', 'lowStock', value) }
//                         />
//                     </div>
//
//                     <div className="flex items-center justify-between py-3">
//                         <div>
//                             <p className="font-medium text-gray-900">New Customer Registrations</p>
//                             <p className="text-sm text-gray-500">Get notified about new customer signups</p>
//                         </div>
//                         <Switch
//                             checked={ settings.notifications.newCustomer }
//                             onChange={ (value) => updateSetting('notifications', 'newCustomer', value) }
//                         />
//                     </div>
//
//                     <div className="flex items-center justify-between py-3">
//                         <div>
//                             <p className="font-medium text-gray-900">Daily Sales Report</p>
//                             <p className="text-sm text-gray-500">Receive daily sales summary</p>
//                         </div>
//                         <Switch
//                             checked={ settings.notifications.dailyReport }
//                             onChange={ (value) => updateSetting('notifications', 'dailyReport', value) }
//                         />
//                     </div>
//
//                     <div className="flex items-center justify-between py-3">
//                         <div>
//                             <p className="font-medium text-gray-900">Weekly Sales Report</p>
//                             <p className="text-sm text-gray-500">Receive weekly sales analysis</p>
//                         </div>
//                         <Switch
//                             checked={ settings.notifications.weeklyReport }
//                             onChange={ (value) => updateSetting('notifications', 'weeklyReport', value) }
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
//
//     const renderSecuritySection = () => (
//         <div className="space-y-6">
//             <div>
//                 <h3 className="text-lg font-semibold mb-4">Security & API</h3>
//                 <div className="space-y-4">
//                     <div className="flex items-center justify-between py-3">
//                         <div>
//                             <p className="font-medium text-gray-900">Two-Factor Authentication</p>
//                             <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
//                         </div>
//                         <Switch
//                             checked={ settings.security.twoFactorAuth }
//                             onChange={ (value) => updateSetting('security', 'twoFactorAuth', value) }
//                         />
//                     </div>
//
//                     <div className="flex items-center justify-between py-3">
//                         <div>
//                             <p className="font-medium text-gray-900">Login Notifications</p>
//                             <p className="text-sm text-gray-500">Get notified about new login attempts</p>
//                         </div>
//                         <Switch
//                             checked={ settings.security.loginNotifications }
//                             onChange={ (value) => updateSetting('security', 'loginNotifications', value) }
//                         />
//                     </div>
//
//                     <div className="flex items-center justify-between py-3">
//                         <div>
//                             <p className="font-medium text-gray-900">API Access</p>
//                             <p className="text-sm text-gray-500">Enable API access for third-party integrations</p>
//                         </div>
//                         <Switch
//                             checked={ settings.security.apiAccess }
//                             onChange={ (value) => updateSetting('security', 'apiAccess', value) }
//                         />
//                     </div>
//
//                     { settings.security.apiAccess && (
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
//                             <Input
//                                 value={ settings.security.webhookUrl }
//                                 onChange={ (value) => updateSetting('security', 'webhookUrl', value) }
//                                 placeholder="https://your-site.com/webhook"
//                                 className="w-full"
//                             />
//                             <p className="text-sm text-gray-500 mt-1">URL to receive webhook notifications</p>
//                         </div>
//                     ) }
//                 </div>
//             </div>
//         </div>
//     );
//
//     const renderContent = () => {
//         switch (activeSection) {
//             case 'store':
//                 return renderStoreSection();
//             case 'payment':
//                 return renderPaymentSection();
//             case 'shipping':
//                 return renderShippingSection();
//             case 'inventory':
//                 return renderInventorySection();
//             case 'notifications':
//                 return renderNotificationsSection();
//             case 'security':
//                 return renderSecuritySection();
//             default:
//                 return renderStoreSection();
//         }
//     };
//
//     return (
//         <div className="min-h-screen bg-gray-50">
//             <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//                 {/* Header */ }
//                 <div className="mb-8">
//                     <div className="flex items-center space-x-3 mb-2">
//                         <Store className="w-8 h-8 text-blue-600"/>
//                         <h1 className="text-3xl font-bold text-gray-900">Shop Settings</h1>
//                     </div>
//                     <p className="text-gray-600">
//                         Manage your online store configuration and preferences
//                     </p>
//                 </div>
//
//                 {/* Save Alert */ }
//                 { saved && (
//                     <div className="mb-6">
//                         <Alert className="border-green-200 bg-green-50">
//                             <AlertDescription className="text-green-800">
//                                 Settings saved successfully!
//                             </AlertDescription>
//                         </Alert>
//                     </div>
//                 ) }
//
//                 {/* Main Content */ }
//                 <div className="flex flex-col lg:flex-row gap-8">
//                     {/* Sidebar */ }
//                     <div className="lg:w-1/4">
//                         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                             <nav className="space-y-1 p-4">
//                                 { sections.map((section) => {
//                                     const Icon = section.icon;
//                                     return (
//                                         <button
//                                             key={ section.id }
//                                             onClick={ () => setActiveSection(section.id) }
//                                             className={ `w-full flex items-center justify-between px-3 py-3 text-left rounded-lg transition-colors ${
//                                                 activeSection === section.id
//                                                     ? 'bg-blue-50 text-blue-700 border border-blue-200'
//                                                     : 'text-gray-700 hover:bg-gray-50'
//                                             }` }
//                                         >
//                                             <div className="flex items-center space-x-3">
//                                                 <Icon className="w-5 h-5"/>
//                                                 <span className="font-medium">{ section.label }</span>
//                                             </div>
//                                             <ChevronRight className="w-4 h-4 text-gray-400"/>
//                                         </button>
//                                     );
//                                 }) }
//                             </nav>
//                         </div>
//                     </div>
//
//                     {/* Content */ }
//                     <div className="lg:w-3/4">
//                         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                             { renderContent() }
//
//                             {/* Save Button */ }
//                             <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
//                                 <button
//                                     onClick={ handleSave }
//                                     className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                                 >
//                                     <Save className="w-4 h-4"/>
//                                     <span>Save Changes</span>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }