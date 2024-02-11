import Image from "next/image";

export const WhiteLogo: React.FC<{ width: number, height: number }> = ({ width, height }) => {
       return <Image src="/images/white-logo.png" alt="white logo" width={width} height={height} />;
}

export const BlackLogo: React.FC<{ width: number, height: number }> = ({ width, height }) => {
       return <Image src="/images/black-logo.png" alt="black logo" width={width} height={height} />;
}