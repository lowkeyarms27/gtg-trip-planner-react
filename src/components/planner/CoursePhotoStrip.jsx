import { useState, useEffect } from 'react';
import { fetchCoursePhotoGoogle } from '../../lib/googleplaces';

export default function CoursePhotoStrip({ courseNames, cityName }) {
  const [photos, setPhotos] = useState({});

  useEffect(() => {
    if (!courseNames || courseNames.length === 0) return;
    setPhotos({});
    courseNames.slice(0, 3).forEach(async (name) => {
      const url = await fetchCoursePhotoGoogle(name, cityName);
      setPhotos((prev) => ({ ...prev, [name]: url || 'fallback' }));
    });
  }, [courseNames, cityName]);

  if (!courseNames || courseNames.length === 0) return null;

  const names = courseNames.slice(0, 3);
  const count = names.length;

  return (
    <div className={`photo-mosaic photo-mosaic--${count}`}>
      {names.map((name, i) => {
        const photo = photos[name];
        const isLoading = !photo;
        const isFallback = photo === 'fallback';

        return (
          <div
            className="photo-mosaic-panel"
            key={name}
            style={{ '--delay': `${i * 0.18}s`, '--kb-dir': i % 2 === 0 ? '1' : '-1' }}
          >
            {isLoading && <div className="skeleton photo-mosaic-skeleton" />}
            {isFallback && (
              <div className="photo-mosaic-fallback">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M5 10c3-2 4 2 7 0s4-4 7-2" />
                  <path d="M5 14c3-2 4 2 7 0s4-4 7-2" />
                </svg>
                <span>{name}</span>
              </div>
            )}
            {!isLoading && !isFallback && (
              <img src={photo} alt={name} className="photo-mosaic-img" loading="lazy" />
            )}
            {!isLoading && (
              <div className="photo-mosaic-overlay">
                <div className="photo-mosaic-caption">{name}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
