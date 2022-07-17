import { useState, useContext, createContext } from 'react';

const defaultProps = {
   content: null,
   isActive: false,
}

const ModalContext = createContext();
const ModalProvider = ({ children }) => {
   const [ modalProps, setModalProps ] = useState(defaultProps);

   return (
      <ModalContext.Provider value={[modalProps, setModalProps]}>
         {children}
      </ModalContext.Provider>
   );
}

const useModal = () => {
   const [ modalProps, setModalProps ] = useContext(ModalContext);

   const setModalContent = content => {
      const updatedProps = {
         content: content,
         isActive: true,
      }
      setModalProps(updatedProps);
   }

   const closeModal = () => {
      const updatedProps = {
         ...modalProps,
         isActive: false,
      }
      setModalProps(updatedProps);
   }

   return {
      modalProps, 
      setModalContent,
      closeModal,
   }
}

export { ModalProvider, useModal };