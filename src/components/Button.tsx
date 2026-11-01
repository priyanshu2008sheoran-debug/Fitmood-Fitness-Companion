import React, { forwardRef } from 'react';
import { Loader2, Check } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'selected';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isSelected?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Reusable, Theme-Aware Button Component for FitMood.
 * Guarantees WCAG AA color contrast across all 6 themes (light & dark).
 * Automatically applies active theme tokens and prevents buttons from blending
 * into parent cards or background surfaces.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isSelected = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled = false,
      className = '',
      children,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    // Base sizing classes
    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
      md: 'px-4 py-2.5 text-xs sm:text-sm rounded-2xl gap-2',
      lg: 'px-6 py-3.5 text-sm sm:text-base rounded-2xl gap-2.5 font-black',
      icon: 'p-2.5 rounded-2xl aspect-square justify-center'
    };

    // Variant mapping to centralized CSS classes that dynamically respond to theme tokens
    const variantClassMap: Record<ButtonVariant, string> = {
      primary: 'btn-primary shadow-md',
      secondary: 'btn-secondary shadow-xs',
      accent: 'btn-accent shadow-md',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      destructive: 'btn-destructive shadow-sm',
      selected: 'btn-selected shadow-md'
    };

    const effectiveVariant = isSelected ? 'selected' : variant;
    const variantClass = variantClassMap[effectiveVariant] || 'btn-primary';
    const isActuallyDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isActuallyDisabled}
        aria-busy={isLoading}
        aria-pressed={isSelected}
        className={`inline-flex items-center justify-center font-bold tracking-tight cursor-pointer transition-all active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-2 ${
          sizeClasses[size]
        } ${variantClass} ${fullWidth ? 'w-full' : ''} ${
          isActuallyDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
        } ${className}`}
        {...rest}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            {loadingText ? <span>{loadingText}</span> : children}
          </>
        ) : (
          <>
            {isSelected && !leftIcon && (
              <Check className="w-4 h-4 stroke-[2.5] shrink-0" aria-hidden="true" />
            )}
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
