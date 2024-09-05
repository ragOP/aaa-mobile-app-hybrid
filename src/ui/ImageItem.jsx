import React, { useState } from 'react'
import { Image } from 'react-native';
import noImg from "../assets/images/no_img.jpg"

const ImageItem = ({url, imageStyle}) => {
  
  return url && url.length > 5 ? (
    <Image source={{ uri: url}} style={imageStyle} />
  ) : (
    <Image source={noImg} style={imageStyle} />
  );
}

export default ImageItem