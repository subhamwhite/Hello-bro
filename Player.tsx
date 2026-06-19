import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import * as storage from '../utils/storage';
import { LoadingSpinner } from '../components/SharedUI';
import VideoPlayer from '../components/VideoPlayer';

export default function Player() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const found = storage.getMovieById(id);
      if (found) {
        setMovie(found);
      } else {
        navigate('/');
      }
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!movie) return null;

  return <VideoPlayer movie={movie} />;
}
