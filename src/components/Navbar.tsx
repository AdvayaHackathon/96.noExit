import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, LogOut } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'as', name: 'অসমীয়া (Assamee)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'tu', name: 'ತುಳು (Tulu)' },
  { code: 'ur', name: 'اردو (Urdu)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)'},
  { code: 'ko', name: 'कोंकणी (Konkani)' },
  { code: 'pu', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ma', name: 'മലയാളം (Malyalam)'},
  { code: 'sa', name: 'संस्कृत (Sanskrit)' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
            Enlighten
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link to="/#features" className="text-gray-700 hover:text-indigo-600">
              {t('nav.features')}
            </Link>
            <Link to="/#testimonials" className="text-gray-700 hover:text-indigo-600">
              {t('nav.testimonials')}
            </Link>
            <Link to="/#contact" className="text-gray-700 hover:text-indigo-600">
              {t('nav.contact')}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-indigo-600"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Register
                </Link>
              </div>
            )}
            
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center text-gray-700 hover:text-indigo-600">
                <Globe className="h-5 w-5 mr-1" />
                <span>{languages.find(lang => lang.code === i18n.language)?.name || 'Language'}</span>
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                {languages.map((language) => (
                  <Menu.Item key={language.code}>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                        } group flex w-full items-center px-4 py-2 text-sm`}
                        onClick={() => changeLanguage(language.code)}
                      >
                        {language.name}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
}