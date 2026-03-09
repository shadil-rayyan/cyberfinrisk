import { render, screen, fireEvent } from '@testing-library/react';
import Button from "@/components/Button";

describe('Button Component', () => {
  it('renders with correct label', () => {
    render(<Button label="Click Me" />);
    const button = screen.getByTestId('my-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click Me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Press" onClick={handleClick} />);
    const button = screen.getByTestId('my-button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
