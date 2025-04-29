import { getBeastImage } from '@/utils/beast'
import { Box, LinearProgress, Typography } from '@mui/material'
import React, { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const loadingBeasts = ["Warlock", "Manticore", "tarrasque", "Colossus", "Basilisk"]

function LoadingContainer() {
  const [isLoading, setIsLoading] = useState(0)
  const [currentBeastIndex, setCurrentBeastIndex] = useState(Math.floor(Math.random() * loadingBeasts.length))
  const [fadeState, setFadeState] = useState('fade-in')
  const [loadingProgress, setLoadingProgress] = useState(0)

  React.useEffect(() => {
    const beastInterval = setInterval(() => {
      setFadeState('fade-out')

      setTimeout(() => {
        setCurrentBeastIndex((prevIndex) => (prevIndex + 1) % loadingBeasts.length)
        setFadeState('fade-in')
      }, 500)

    }, 4000)

    return () => clearInterval(beastInterval)
  }, [])

  // Simulate loading progress
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  function PreloadBannerImages() {
    return <>
      {React.Children.toArray(
        loadingBeasts.map(beast =>
          <LazyLoadImage
            alt={""}
            height={1}
            src={getBeastImage(beast)}
            width={1}
            onLoad={() => { setIsLoading(prev => prev + 1) }}
          />
        ))}
    </>
  }

  return (
    <Box sx={styles.container}>
      {isLoading < loadingBeasts.length && PreloadBannerImages()}

      <Box sx={styles.contentContainer}>
        <Box sx={styles.beastContainer}>
          {isLoading >= loadingBeasts.length && (
            <Box sx={styles.beastImageContainer}>
              <img
                alt={loadingBeasts[currentBeastIndex]}
                src={getBeastImage(loadingBeasts[currentBeastIndex])}
                style={{
                  ...styles.beastImage,
                  animation: `pulse 4s infinite, ${fadeState} 0.5s ease-in-out`
                }}
              />
            </Box>
          )}
        </Box>

        <Box sx={styles.textContainer}>
          <Typography variant="h4" color="primary" sx={styles.loadingText}>
            Loading Game
          </Typography>

          <Box display={'flex'} alignItems={'baseline'}>
            <Typography variant="body1" color="white" sx={styles.loadingSubtext}>
              {loadingProgress === 0 && 'Awakening The Beasts'}
              {loadingProgress >= 1 && loadingProgress < 50 && 'Initializing Game'}
              {loadingProgress >= 50 && loadingProgress < 70 && 'Loading Assets'}
              {loadingProgress >= 70 && 'Almost Ready'}
            </Typography>
            <div className='dotLoader white' />
          </Box>
        </Box>
      </Box>

      <Box sx={styles.progressContainer}>
        <LinearProgress
          variant="determinate"
          value={loadingProgress}
          sx={styles.progressBar}
        />
        <Typography variant="body2" color="primary" sx={styles.progressText}>
          {Math.round(loadingProgress)}%
        </Typography>
      </Box>
    </Box>
  )
}

export default LoadingContainer

const styles = {
  container: {
    width: '500px',
    maxWidth: '100vw',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.6))',
    position: 'relative',
    overflow: 'hidden'
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    position: 'relative'
  },
  beastContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    width: '100%',
    position: 'relative'
  },
  beastImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%'
  },
  beastImage: {
    height: '60%',
    maxWidth: '100%',
    objectFit: 'contain' as const,
    filter: 'drop-shadow(0 0 10px rgba(0, 255, 0, 0.7))'
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
    textAlign: 'center'
  },
  loadingText: {
    marginBottom: '10px',
    textShadow: '0 0 10px rgba(0, 255, 0, 0.7)',
    animation: 'glow 4s infinite'
  },
  loadingSubtext: {
    opacity: 0.8
  },
  progressContainer: {
    width: '80%',
    maxWidth: '480px',
    marginBottom: '40px',
    position: 'relative'
  },
  progressBar: {
    height: '10px',
    borderRadius: '5px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#00FF00',
      borderRadius: '5px'
    }
  },
  progressText: {
    position: 'absolute',
    right: '0',
    top: '-20px',
    fontSize: '14px'
  }
}