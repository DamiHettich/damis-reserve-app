import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from '../LanguageSwitcher';

const mockChangeLanguage = jest.fn();

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders both language buttons', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByAltText('English')).toBeInTheDocument();
    expect(screen.getByAltText('Español')).toBeInTheDocument();
  });

  it('shows English as active when language is "en"', () => {
    render(<LanguageSwitcher />);
    const enButton = screen.getByAltText('English').parentElement;
    const esButton = screen.getByAltText('Español').parentElement;
    
    expect(enButton).toHaveClass('ring-2');
    expect(esButton).not.toHaveClass('ring-2');
  });

  it('changes language to Spanish when Spanish button is clicked', () => {
    render(<LanguageSwitcher />);
    const esButton = screen.getByAltText('Español').parentElement;
    fireEvent.click(esButton!);
    expect(mockChangeLanguage).toHaveBeenCalledWith('es');
  });

  it('changes language to English when English button is clicked', () => {
    render(<LanguageSwitcher />);
    const enButton = screen.getByAltText('English').parentElement;
    fireEvent.click(enButton!);
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  it('maintains correct spacing between buttons', () => {
    render(<LanguageSwitcher />);
    const container = screen.getByTestId('language-switcher');
    expect(container).toHaveClass('space-x-2');
  });
});
