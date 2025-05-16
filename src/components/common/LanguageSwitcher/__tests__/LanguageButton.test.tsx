import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageButton } from '../LanguageButton';

describe('LanguageButton', () => {
  const defaultProps = {
    language: 'en',
    isActive: false,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with English flag when language is "en"', () => {
    render(<LanguageButton {...defaultProps} />);
    const img = screen.getByAltText('English');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/flags/en.svg');
  });

  it('renders with Spanish flag when language is "es"', () => {
    render(<LanguageButton {...defaultProps} language="es" />);
    const img = screen.getByAltText('Español');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/flags/es.svg');
  });

  it('shows active state with ring when isActive is true', () => {
    render(<LanguageButton {...defaultProps} isActive={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ring-2', 'ring-primary-600');
  });

  it('does not show ring when isActive is false', () => {
    render(<LanguageButton {...defaultProps} isActive={false} />);
    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('ring-2', 'ring-primary-600');
  });

  it('calls onClick handler when clicked', () => {
    render(<LanguageButton {...defaultProps} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('maintains correct dimensions', () => {
    render(<LanguageButton {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-8', 'h-6');
    const img = screen.getByRole('img');
    expect(img).toHaveClass('w-8', 'h-6');
  });
});
