export function ErrorMessage({ message }: { message: string }) {
  return (
    <div role="alert" className="error">
      <strong>Something went wrong.</strong> {message}
    </div>
  );
}
