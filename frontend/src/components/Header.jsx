export default function Header ({title, subtitle}) {
    return (
        <div className="ml-[2rem] mt-[1rem] leading-[18px]">
            <h1 className="text-4xl text-black my-2">{title}</h1>
            <p className="text-gray">{subtitle}</p>
        </div>
    )
}