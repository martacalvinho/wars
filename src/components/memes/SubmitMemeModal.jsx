import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { submitMeme, supabase } from '../../lib/supabase';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 11, 30, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: rgba(26, 27, 58, 0.95);
  border-radius: 20px;
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  position: relative;
  backdrop-filter: blur(10px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(26, 27, 58, 0.4);
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary}40;
    border-radius: 3px;
    
    &:hover {
      background: ${props => props.theme.colors.primary};
    }
  }
`;

const Title = styled.h2`
  font-family: ${props => props.theme.fonts.heading};
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  text-shadow: 0 0 10px ${props => props.theme.colors.primary}40;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  background: rgba(26, 27, 58, 0.9);
  border: 1px solid ${props => props.theme.colors.primary}40;
  border-radius: 10px;
  padding: 0.75rem;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.body};
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error};
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const UploadArea = styled.div`
  border: 2px dashed ${props => props.theme.colors.primary}40;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  ${props => props.$hasFile && `
    border-color: ${props.theme.colors.primary};
    background: rgba(255, 51, 102, 0.1);
  `}
`;

const UploadIcon = styled.span`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 10px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const SubmitButton = styled(motion.button)`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 10px;
  font-family: ${props => props.theme.fonts.heading};
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.5rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const SubmitMemeModal = ({ isOpen, onClose, battleId, team }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    submissionName: '',
    twitterHandle: '',
    telegramHandle: ''
  });

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreview(null);
      setFormData({
        submissionName: '',
        twitterHandle: '',
        telegramHandle: ''
      });
      setError(null);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue = name.includes('Handle') && value.startsWith('@') 
      ? value.substring(1) 
      : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: cleanedValue
    }));
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        setFile(null);
        setPreview(null);
        return;
      }
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      setError(null);
    }
  };

  const validateForm = () => {
    if (!formData.submissionName.trim()) {
      setError('Please enter a submission name');
      return false;
    }
    if (!file) {
      setError('Please upload a meme image');
      return false;
    }
    if (!user) {
      setError('Please sign in to submit a meme');
      return false;
    }
    if (!battleId || !team) {
      setError('Invalid battle or team selection');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submit clicked with:', {
      file,
      preview,
      formData,
      battleId,
      team,
      user
    });

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Starting meme submission...', { battleId, team, user });

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${battleId}/${Math.random()}.${fileExt}`;
      
      console.log('Uploading file...', fileName);
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('memes')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload image: ' + uploadError.message);
      }

      console.log('File uploaded successfully:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('memes')
        .getPublicUrl(fileName);

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      console.log('Got public URL:', publicUrl);

      const memeData = {
        battleId,
        userId: user.id,
        imageUrl: publicUrl,
        team,
        submissionName: formData.submissionName,
        twitterHandle: formData.twitterHandle,
        telegramHandle: formData.telegramHandle,
        walletAddress: user.wallet_address
      };

      console.log('Submitting meme data:', memeData);

      const result = await submitMeme(memeData);
      console.log('Meme submitted successfully:', result);

      onClose();
    } catch (err) {
      console.error('Error submitting meme:', err);
      setError(err.message || 'Failed to submit meme. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Modal
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>×</CloseButton>
            <Title>Submit Your Meme</Title>
            
            <Form onSubmit={handleSubmit}>
              {error && (
                <ErrorMessage>{error}</ErrorMessage>
              )}
              
              <InputGroup>
                <label>Submission Name *</label>
                <Input
                  type="text"
                  name="submissionName"
                  placeholder="Give your meme a name"
                  value={formData.submissionName}
                  onChange={handleInputChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <label>Twitter Handle</label>
                <Input
                  type="text"
                  name="twitterHandle"
                  placeholder="yourtwitterhandle"
                  value={formData.twitterHandle}
                  onChange={handleInputChange}
                />
              </InputGroup>

              <InputGroup>
                <label>Telegram Handle</label>
                <Input
                  type="text"
                  name="telegramHandle"
                  placeholder="yourtelegramhandle"
                  value={formData.telegramHandle}
                  onChange={handleInputChange}
                />
              </InputGroup>

              <InputGroup>
                <label>Upload Meme *</label>
                <HiddenInput
                  type="file"
                  id="meme-upload"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <UploadArea
                  as="label"
                  htmlFor="meme-upload"
                  $hasFile={!!preview}
                >
                  {preview ? (
                    <PreviewImage src={preview} alt="Meme preview" />
                  ) : (
                    <>
                      <UploadIcon>📸</UploadIcon>
                      <p>Click to upload your meme (max 5MB)</p>
                    </>
                  )}
                </UploadArea>
              </InputGroup>

              <SubmitButton
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? 'Submitting...' : 'Submit Meme'}
              </SubmitButton>
            </Form>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default SubmitMemeModal;