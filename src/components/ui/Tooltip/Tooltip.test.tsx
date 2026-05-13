import * as RadixTooltip from '@radix-ui/react-tooltip';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders trigger', () => {
    render(
      <RadixTooltip.Provider>
        <Tooltip content="Yardım metni">
          <button type="button">Hover et</button>
        </Tooltip>
      </RadixTooltip.Provider>,
    );
    expect(screen.getByRole('button', { name: 'Hover et' })).toBeInTheDocument();
  });
});
