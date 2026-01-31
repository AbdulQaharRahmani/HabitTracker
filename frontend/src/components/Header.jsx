export default function Header({ title, subtitle }) {
  return (
    <div className="ml-[2rem] mt-[1rem] leading-[18px]">
      <h1
        className="text-4xl my-2 text-gray-900 dark:text-gray-100
"
      >
        {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
    </div>
  );
}
