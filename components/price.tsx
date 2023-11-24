
const Price = ({
  amount,
  className,
  currencyCode = 'USD',
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<'p'>) => (
  <p suppressHydrationWarning={true} className={className}>
    {`${new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount))}`}
  </p>
);

export default Price;
