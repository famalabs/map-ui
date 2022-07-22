import React from 'react';
import { render, getByText, fireEvent } from '@testing-library/react';
import { ButtonLoading } from '@src/components/simple';

describe('Button', () => {
  test('should display text', () => {
    const { container } = render(<ButtonLoading loading={false} label="We Salute You!" />);

    getByText(container, 'We Salute You!');
  });

  test('should handle click events', () => {
    const onClickMock = jest.fn();
    const { container } = render(<ButtonLoading loading={false} label="Click me" onClick={onClickMock} />);
    const component = container.firstChild;

    fireEvent.click(component);

    expect(onClickMock).toBeCalled();
  });
});
