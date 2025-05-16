import { render, screen, fireEvent } from '@testing-library/react';
import ColorPicker from '../ColorPicker';

// Mock react-colorful
jest.mock('react-colorful', () => ({
  HexColorPicker: ({ color, onChange }: { color: string; onChange: (color: string) => void }) => (
    <div data-testid="mock-color-picker" data-color={color}>
      <button onClick={() => onChange('#ff0000')}>Change Color</button>
    </div>
  ),
}));

describe('ColorPicker', () => {
  const defaultProps = {
    color: '#000000',
    onChange: jest.fn(),
    label: 'Pick a color',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with initial color and label', () => {
    render(<ColorPicker {...defaultProps} />);
    expect(screen.getByText('Pick a color')).toBeInTheDocument();
    expect(screen.getByText('#000000')).toBeInTheDocument();
  });

  it('opens color picker on click', () => {
    render(<ColorPicker {...defaultProps} />);
    const colorButton = screen.getByRole('button');
    
    expect(screen.queryByTestId('mock-color-picker')).not.toBeInTheDocument();
    fireEvent.click(colorButton);
    expect(screen.getByTestId('mock-color-picker')).toBeInTheDocument();
  });

  it('closes color picker when clicking outside', () => {
    render(<ColorPicker {...defaultProps} />);
    
    // Open picker
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('mock-color-picker')).toBeInTheDocument();
    
    // Click outside
    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId('mock-color-picker')).not.toBeInTheDocument();
  });

  it('calls onChange when color is changed', () => {
    render(<ColorPicker {...defaultProps} />);
    
    // Open picker and change color
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Change Color'));
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('#ff0000');
  });

  it('displays the current color value', () => {
    render(<ColorPicker {...defaultProps} color="#ff0000" />);
    expect(screen.getByText('#ff0000')).toBeInTheDocument();
  });
});
