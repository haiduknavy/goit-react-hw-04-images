/* eslint-disable react-hooks/exhaustive-deps */
import Loader from 'Components/Loader/Loader';
import { useState, useEffect } from 'react';
import fetchGallery from '../../api/api';
import Searchbar from '../Searchbar/Searchbar';
import ImageGallery from '../ImageGallery/ImageGallery';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import { AppWrap } from './App.styled';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');

  useEffect(() => {
    if (searchQuery === '') {
      return;
    } else {
      searchImg(searchQuery, page);
    }
  }, [searchQuery, page]);
  
  const handleChangeSearch = searchQ => {
    if (searchQ !== searchQuery) {
      setSearchQuery(searchQ);
      setPage(1);
      setImages([]);
    }
    return;
  };

  const toggleLoading = () => {
    setLoading(loading => !loading);
  };

  const searchImg = async () => {
    toggleLoading();

    try {
      const data = await fetchGallery(searchQuery, page);
      setImages([...images, ...data.hits]);
    } catch (e) {
      console.error(e);
    } finally {
      toggleLoading();
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleImageClick = image => {
    setModalImage(image);
    toggleModal();
  };

  const handlerLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <AppWrap>
      <Searchbar onSubmit={handleChangeSearch} />
      {images.length > 0 && (
        <ImageGallery images={images} onImageClick={handleImageClick} />
      )}
      {showModal && <Modal largeImg={modalImage} onClose={toggleModal} />}
      {images.length > 0 && images.length / page === 12 && (
        <Button onButtonClick={handlerLoadMore} />
      )}
      {loading && <Loader />}
    </AppWrap>
  );
};

export default App;
