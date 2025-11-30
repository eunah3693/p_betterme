import { txtVariants } from '@/constants/style';
import Image from 'next/image'
import logo_white from '/public/assets/logo_white.svg'
import { footerData } from '@/constants/strings';

function Footer() {
  return (
    <div className='bg-gray3'>
      <div className='w-[1280px] max-w-full mx-auto py-10 px-10 flex justify-between items-center text-white'>
          <div>
            <Image src={logo_white} alt="logo" width={100}/>
          </div>
          <div className='text-right'>
            <div className={txtVariants.txt15}>{footerData.phone}</div>
            <div className={txtVariants.txt15}>{footerData.name}</div>
          </div>
      </div>
    </div>
  );
}

export default Footer;
