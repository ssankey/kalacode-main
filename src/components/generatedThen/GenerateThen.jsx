/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdClose, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import images from '../../pages/data';
import Generate from '../generator/Generator';
import './GeneratedThen.css';
import logo from '../../assets/Group 80.png'


const GenerateThen = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showTextSequence, setShowTextSequence] = useState(false);
  const [showGallery, setShowGallery] = useState(true);
  const [showGenerate, setShowGenerate] = useState(false);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleModalClick = () => {
    setShowGallery(false);
    setShowGenerate(true);
  };


  useEffect(() => {
    const letterSpans = document.querySelectorAll('.fade-in-letter');
    letterSpans.forEach((letter, index) => {
      setTimeout(() => {
        letter.style.animationDelay = `${index * 0.15}s`;
      }, 0);
    });
  }, []);


  return (
    <div className='h-screen generated-then w-screen bg-black'>
   
      <div className='flex justify-between z-50 items-center px-4 sm:px-12 py-4 pt-5'>
        <div className='sm:w-auto z-50 w-full'>
          <Link to={'/'} >
            <img src={logo} className="sm:w-[8rem] bg-none w-[5rem] cursor-pointer" alt="logo" />
          </Link>
        </div>
        {/* <div
            className='sm:text-right text-white z-[100] cursor-pointer'
            onClick={handleMenuClick}
          >
            {showMenu ? (
              <div className="relative sm:left-6 p-5">
                <div className="corner-button-home"></div>
                <div className="corner-button-home"></div>
                <div className="corner-button-home"></div>
                <div className="corner-button-home"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2  -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-white/20 flex items-center justify-center">
                    <MdClose size={24} color="white" />
                  </div>
                </div>

              </div>
            ) : (
              'MENU'
            )}
          </div> */}
      </div>
      {showGallery && (
        <>
          <div className="relative text-white sm:ml-28 pl-4 sm:pl-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl sm:text-6xl uppercase fade-in-letters">
                <span className="block">
                  <span className="fade-in-letter">P</span>
                  <span className="fade-in-letter">A</span>
                  <span className="fade-in-letter">S</span>
                  <span className="fade-in-letter">T</span>
                </span>
                <br/>
                <span className="block ml-4 sm:ml-16">
                  <span className="fade-in-letter">G</span>
                  <span className="fade-in-letter">E</span>
                  <span className="fade-in-letter">N</span>
                  <span className="fade-in-letter">E</span>
                  <span className="fade-in-letter">R</span>
                  <span className="fade-in-letter">A</span>
                  <span className="fade-in-letter">T</span>
                  <span className="fade-in-letter">I</span>
                  <span className="fade-in-letter">O</span>
                  <span className="fade-in-letter">N</span>
                  <span className="fade-in-letter">S</span>
                </span>
              </h2>
              {/* ... Other code ... */}
            </div>

            <p className="sm:ml-16 py-5 sm:pl-0">
              Check out our creations and remix them using the associated prompts.<br /> Click on the images to get the full prompt.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-20 sm:ml-24 justify-center p-10">
            {images.map((image, index) => (
                <div
                  className="relative w-full sm:w-96    p-10  mx-auto h-[30rem] flex items-center justify-center bg-gray-400/10 flex-col cursor-pointer hover:bg-white/30 hover:bg-opacity-20 transition duration-300 ease-in-out"
                  onClick={() => openModal(image)}
                >
                  <div className="corner-border"></div> {/* Top left corner border */}
                  <div className="corner-border"></div> {/* Top right corner border */}
                  <div className="corner-border"></div> {/* Bottom left corner border */}
                  <div className="corner-border"></div> {/* Bottom right corner border */}
                  <img
                    src={image.src}
                    alt={image.description}
                    className="w-52  h-52 outline z-50 outline-white/20 outline-offset-8 sm:opacity-50 hover:opacity-100 transition duration-300 ease-in-out object-cover"
                  />
                  <p className="text-white text-center pt-5">SNOWY CITY</p>
                </div>


            ))}
          </div>

          {selectedImage && (
            <div className="fixed image-modal inset-0  flex items-center justify-center bg-black bg-opacity-10 z-50">
              <div className="bg-black bg-opacity-80 w-[90%] px-10 sm:w-[60rem] flex justify-center items-center flex-col relative">
                <div className="corner-border-modal"></div> {/* Top left corner border */}
                <div className="corner-border-modal"></div> {/* Top right corner border */}
                <div className="corner-border-modal"></div> {/* Bottom left corner border */}
                <div className="corner-border-modal"></div> {/* Bottom right corner border */}
                <button
                  className="absolute top-0 left-0 p-2 sm:m-4 text-white"
                  onClick={closeModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div>
                  <p className='text-white text-xl mt-8'>PROMPT</p>
                </div>
                <div className="relative mt-10">
                  <div className="corner-border-pop"></div> {/* Top left corner border */}
                  <div className="corner-border-pop"></div> {/* Top right corner border */}
                  <div className="corner-border-pop"></div> {/* Bottom left corner border */}
                  <div className="corner-border-pop"></div> {/* Bottom right corner border */}
                  <img
                    id="qrCodeImage"
                    src={selectedImage.src}
                    alt="qrcode"
                    className="sm:h-80 relative outline outline-2 outline-white/10 outline-offset-4 sm:w-80 max-w-full h-auto bg-none"
                  />

                </div>

                <div className="mt-5 w-full sm:w-[80%] md:w-[80%] lg:w-[80%] xl:w-[80%] 2xl:w-[80%]  text-center">
                  <textarea
                    id="prompt"
                    rows={5}
                    className="w-full p-2 sm:mt-2 overflow-hidden sm:text-[20px] bg-black text-white/80 border-2 border-gray-400 outline-none"
                    value={selectedImage.description}
                  ></textarea>
                </div>

                <div className="mt-8 sm:pb-8 flex justify-center">
                  <button className="relative outline outline-offset-2 outline-gray-400/50 outline-1 bg-gray-300 text-black border text-center pl-10 pr-14 py-2 mb-8 sm:mb-3" onClick={handleModalClick}>
                    <div className="corner-button-home"></div>
                    <div className="corner-button-home"></div>
                    <div className="corner-button-home"></div>
                    <div className="corner-button-home"></div>
                    <span className="button-content">USE PROMPT</span>
                    <div className="absolute top-0 left-[10.2rem] py-4 w-12 h-full bg-[#2a2988] text-white flex justify-center items-center "><MdOutlineKeyboardArrowRight /></div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {showGenerate && (
        <div className='flex items-center justify-center h-full'>
          <div className='w-full'>
            <Generate imageDescription={selectedImage?.description || ''} />
          </div>
        </div>
      )}


    </div>
  );
};

export default GenerateThen;
