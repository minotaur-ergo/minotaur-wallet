import React from 'react';
import { render } from '@testing-library/react';
import MinotaurApp from './MinotaurApp';

test('renders learn react link', () => {
  const { getByText } = render(<MinotaurApp />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
