import HomeScreen from '../components/Home/HomeScreen';
import SplashLoading from '../components/SplashLoading/SplashLoading';
import CategoriesScreen from '../components/Tabs/Categories/CategoriesScreen';
import CardPaymentScreen from '../components/Tabs/Deals/CardPaymentScreen';
import CartScreen from '../components/Tabs/Deals/CartScreen';
import CategoriesDealsScreen from '../components/Tabs/Deals/CategoriesDealsScreen';
import DealDetailScreen from '../components/Tabs/Deals/DealDetailScreen';
import DealsScreen from '../components/Tabs/Deals/DealsScreen';
import MyOrdersScreen from '../components/Tabs/Deals/MyOrdersScreen';
import PaymentScreen from '../components/Tabs/Deals/PaymentScreen';
import ProductAboutScreen from '../components/Tabs/Deals/ProductAboutScreen';
import ProductDetailScreen from '../components/Tabs/Deals/ProductDetailScreen';
import ProductLocationScreen from '../components/Tabs/Deals/ProductLocationScreen';
import WebSiteScreen from '../components/Tabs/Deals/WebSiteScreen';
import AboutScreen from '../components/Tabs/MyDibbs/AboutScreen';
import ForgotPasswordScreen from '../components/Tabs/MyDibbs/Authentication/ForgotPasswordScreen';
import LoginScreen from '../components/Tabs/MyDibbs/Authentication/LoginScreen';
import RefferalScreen from '../components/Tabs/MyDibbs/Authentication/RefferalScreen';
import SignUpScreen from '../components/Tabs/MyDibbs/Authentication/SignUpScreen';
import CustomerSupportScreen from '../components/Tabs/MyDibbs/CustomerSupportScreen';
import FAQsScreen from '../components/Tabs/MyDibbs/FAQsScreen';
import FeaturesScreen from '../components/Tabs/MyDibbs/FeaturesScreen';
import MyDibbsScreen from '../components/Tabs/MyDibbs/MyDibbsScreen';
import NotificationSettingsScreen from '../components/Tabs/MyDibbs/NotificationSettingsScreen';
import PrivacyPolicyScreen from '../components/Tabs/MyDibbs/PrivacyPolicyScreen';
import ShareAppScreen from '../components/Tabs/MyDibbs/ShareAppScreen';
import TermsAndConditionsScreen from '../components/Tabs/MyDibbs/TermsAndConditionsScreen';
import SavedScreen from '../components/Tabs/Saved/SavedScreen';
import SearchScreen from '../components/Tabs/Search/SearchScreen';
import BottomNavigator from './BottomNavigator';
import CategoriesDealsNavigator from './CategoriesDealsNavigator';
import DealsNavigator from './DealsNavigator';

export const Screens = {
  SplashScreen: SplashLoading,

  HomeScreen: HomeScreen,

  BottomNavigator: BottomNavigator,
  DealsNavigator: DealsNavigator,
  CategoriesDealsNavigator: CategoriesDealsNavigator,

  CategoriesDealsScreen: CategoriesDealsScreen,
  DealsScreen: DealsScreen,
  ProductDetailScreen: ProductDetailScreen,
  ProductAboutScreen: ProductAboutScreen,
  ProductLocationScreen: ProductLocationScreen,
  WebSiteScreen: WebSiteScreen,
  CartScreen: CartScreen,

  PaymentScreen: PaymentScreen,
  CardPaymentScreen: CardPaymentScreen,

  MyOrdersScreen: MyOrdersScreen,

  SearchScreen: SearchScreen,

  CategoriesScreen: CategoriesScreen,

  SavedScreen: SavedScreen,

  MyDibbsScreen: MyDibbsScreen,

  NotificationSettingsScreen: NotificationSettingsScreen,
  FeaturesScreen: FeaturesScreen,
  AboutScreen: AboutScreen,
  ShareAppScreen: ShareAppScreen,
  CustomerSupportScreen: CustomerSupportScreen,

  PrivacyPolicyScreen: PrivacyPolicyScreen,
  TermsAndConditionsScreen: TermsAndConditionsScreen,

  LoginScreen: LoginScreen,
  SignUpScreen: SignUpScreen,
  RefferalScreen: RefferalScreen,
  ForgotPasswordScreen: ForgotPasswordScreen,

  FAQsScreen: FAQsScreen,

  DealDetailScreen: DealDetailScreen,
};
