'use client';

import { forwardRef, type ComponentProps, type MouseEvent } from 'react';
import { Icon } from '@iconify/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export interface ButtonWidthType {
  mobile?: 'fill' | 'hug' | string;
  tablet?: 'fill' | 'hug' | string;
  desktop?: 'fill' | 'hug' | string;
}

const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center',
    'font-bold whitespace-nowrap transition-all duration-100 ease-in',
    'rounded-[12px] select-none',
    'focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-primary-200',
    'disabled:cursor-not-allowed cursor-pointer',
  ].join(' '),
  {
    variants: {
      variant: {
        filled:
          'bg-primary-200 text-black-0 border border-primary-200 hover:bg-primary-100 hover:border-primary-100 active:brightness-95 disabled:bg-primary-20 disabled:border-primary-20 disabled:text-black-0',
        outlined:
          'bg-transparent text-primary-200 border border-primary-200 hover:bg-primary-10 hover:border-primary-100 hover:text-primary-100 active:bg-primary-20/30 disabled:text-primary-20 disabled:border-primary-20',
        text:
          'bg-transparent text-primary-200 border border-transparent hover:text-primary-100 hover:bg-primary-10 active:bg-primary-20/30 disabled:text-primary-20',
      },
      size: {
        'large-cta': 'h-14 px-8 py-4 text-2xl leading-7',
        medium: 'h-12 px-6 py-3 text-base leading-[19px]',
        small: 'h-[34px] px-4 py-2 text-sm leading-[21px]',
        'mobile-lg': 'h-6 px-2 py-1 text-xs leading-[18px]',
      },
      tone: {
        primary: '',
        danger: '',
        neutral: '',
        success: '',
        alert: '',
      },
      fullWidth: { true: 'w-full', false: 'w-fit' },
      loading: { true: 'pointer-events-none', false: '' },
    },
    compoundVariants: [
      { variant: 'filled', tone: 'danger', class: 'bg-system-error border-system-error text-black-0 hover:brightness-90 disabled:bg-system-error/50' },
      { variant: 'filled', tone: 'neutral', class: 'bg-black-100 border-black-100 text-black-0 hover:bg-black-90 disabled:bg-black-10' },
      { variant: 'filled', tone: 'success', class: 'bg-system-success border-system-success text-black-0 hover:brightness-90 disabled:bg-system-success/40' },
      { variant: 'filled', tone: 'alert', class: 'bg-system-alert border-system-alert text-black-100 hover:brightness-95 disabled:bg-system-alert/40' },

      { variant: 'outlined', tone: 'danger', class: 'text-system-error border-system-error hover:text-red-600 hover:border-red-600 hover:bg-system-error/10 disabled:text-system-error/50 disabled:border-system-error/50' },
      { variant: 'outlined', tone: 'neutral', class: 'text-black-100 border-black-100 hover:text-black-90 hover:border-black-90 hover:bg-black-10 disabled:text-black-10 disabled:border-black-10' },
      { variant: 'outlined', tone: 'success', class: 'text-system-success border-system-success hover:bg-system-success/10 disabled:text-system-success/50 disabled:border-system-success/50' },
      { variant: 'outlined', tone: 'alert', class: 'text-system-alert border-system-alert hover:bg-system-alert/10 disabled:text-system-alert/50 disabled:border-system-alert/50' },

      { variant: 'text', tone: 'danger', class: 'text-system-error hover:text-red-600 hover:bg-system-error/10 disabled:text-system-error/50' },
      { variant: 'text', tone: 'neutral', class: 'text-black-100 hover:text-black-90 hover:bg-black-10 disabled:text-black-10' },
      { variant: 'text', tone: 'success', class: 'text-system-success hover:bg-system-success/90 hover:bg-system-success/10 disabled:text-system-success/50' },
      { variant: 'text', tone: 'alert', class: 'text-system-alert hover:text-yellow-600 hover:bg-system-alert/10 disabled:text-system-alert/50' },
    ],
    defaultVariants: {
      variant: 'filled',
      size: 'medium',
      tone: 'primary',
      fullWidth: false,
      loading: false,
    },
  },
);

type ButtonBaseProps = ComponentProps<'button'>;

export interface ButtonProps
  extends ButtonBaseProps,
    VariantProps<typeof buttonVariants> {
  width?: 'fill' | 'hug' | string | ButtonWidthType;
  leftIcon?: string;
  loading?: boolean;
  loadingIcon?: string;
  withIcon?: boolean;
}

function computeWidth(width?: ButtonProps['width']) {
  if (!width) return 'w-fit';
  if (typeof width === 'string') {
    if (width === 'fill') return 'w-full';
    if (width === 'hug') return 'w-fit';
    return width;
  }
  const classes: string[] = [];
  if (width.mobile) classes.push(width.mobile === 'fill' ? 'w-full' : width.mobile === 'hug' ? 'w-fit' : `w-[${width.mobile}]`);
  if (width.tablet) classes.push(width.tablet === 'fill' ? 'md:w-full' : width.tablet === 'hug' ? 'md:w-fit' : `md:w-[${width.tablet}]`);
  if (width.desktop) classes.push(width.desktop === 'fill' ? 'lg:w-full' : width.desktop === 'hug' ? 'lg:w-fit' : `lg:w-[${width.desktop}]`);
  return classes.length ? classes.join(' ') : 'w-fit';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    tone,
    width,
    fullWidth,
    disabled,
    leftIcon,
    loading = false,
    loadingIcon = 'svg-spinners:270-ring',
    withIcon = false,
    children,
    onClick,
    ...props
  },
  ref,
) {
  const widthClass = computeWidth(width);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      className={cn(
        buttonVariants({ variant, size, tone, fullWidth, loading }),
        withIcon ? 'pl-10 pr-4' : 'px-6',
        widthClass,
        className,
      )}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      <span className="flex-1 flex items-center justify-center relative">
        {withIcon && (loading || leftIcon) && (
          <span className="absolute left-4 inline-flex items-center">
            {loading ? (
              <Icon className="animate-spin min-w-6 w-6 min-h-6 h-6" icon={loadingIcon} />
            ) : (
              leftIcon && <Icon className='min-w-6 w-6 min-h-6 h-6' icon={leftIcon} />
            )}
          </span>
        )}
        <span>{children}</span>
      </span>
    </button>
  );
});

export default Button;
