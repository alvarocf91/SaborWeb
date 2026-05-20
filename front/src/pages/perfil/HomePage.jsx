import { useContext, useRef } from "react";
import {
  Container,
  Typography,
  Card,
  Box,
  useMediaQuery,
  useTheme,
  Divider,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { SaborwebContext } from "../../context/SaborwebProvider";
import { useLanguage } from "../../hooks/useLanguage";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SetMealIcon from '@mui/icons-material/SetMeal';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import RecetaCard from "../../components/RecetaCard";
import PropTypes from "prop-types";

const StyledFeatureCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  height: "100%",
  padding: theme.spacing(3),
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  transition: "all 0.4s cubic-bezier(0.23, 1, 0.320, 1)",
  background: "linear-gradient(135deg, #ffffff 0%, #f9fcff 100%)",
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
  border: "1px solid rgba(29, 112, 184, 0.08)",
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4.5),
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #1D70B8, #00a0ff, transparent)",
    opacity: 0,
    transition: "opacity 0.4s ease",
  },
  "&:hover": {
    transform: "translateY(-12px)",
    boxShadow: "0 20px 40px rgba(29, 112, 184, 0.15), 0 0 60px rgba(29, 112, 184, 0.08)",
    background: "linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)",
    border: "1px solid rgba(29, 112, 184, 0.15)",
    "&::before": {
      opacity: 1,
    }
  },
}));

const StyledStatsCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  padding: theme.spacing(3.5),
  height: "100%",
  background: "linear-gradient(135deg, #1D70B8 0%, #0059b3 50%, #1D70B8 100%)",
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.23, 1, 0.320, 1)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4.5),
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    right: "-50%",
    width: "100%",
    height: "100%",
    background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
    borderRadius: "50%",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 100%)",
    pointerEvents: "none",
  },
  "&:hover": {
    transform: "translateY(-8px) scale(1.03)",
    boxShadow: "0 20px 50px rgba(29, 112, 184, 0.35), 0 0 80px rgba(29, 112, 184, 0.2)",
    background: "linear-gradient(135deg, #1D70B8 0%, #005fcc 50%, #0059b3 100%)",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  display: "inline-block",
  color: "#1D70B8",
  fontWeight: 800,
  marginBottom: theme.spacing(3),
  textAlign: "center",
  fontSize: "1.85rem",
  letterSpacing: "-0.5px",
  [theme.breakpoints.up('sm')]: {
    fontSize: "2.15rem",
    marginBottom: theme.spacing(4),
  },
  [theme.breakpoints.up('md')]: {
    fontSize: "2.5rem",
    marginBottom: theme.spacing(5),
  },
  "&:after": {
    content: '""',
    position: "absolute",
    width: "50px",
    height: "4px",
    borderRadius: "2px",
    background: "linear-gradient(90deg, #1D70B8, #00a0ff)",
    bottom: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    [theme.breakpoints.up('sm')]: {
      width: "70px",
      height: "5px",
      bottom: "-14px",
    },
    [theme.breakpoints.up('md')]: {
      width: "90px",
      height: "6px",
      bottom: "-16px",
    },
  },
}));

const SlideWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  height: "100%",
  display: "flex",
  alignItems: "stretch",
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1.5),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2),
  },
}));

const ResponsiveContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(6),
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(8),
  },
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(10),
  },
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  margin: `0 ${theme.spacing(8)}`,
  [theme.breakpoints.down('sm')]: {
    margin: `0 ${theme.spacing(6)}`,
  },
  [theme.breakpoints.down('xs')]: {
    margin: `0 ${theme.spacing(4)}`,
  },
}));

export default function HomePage() {
  const { recetasMejorValoradas, recetasMasVistas } = useContext(SaborwebContext);
  const { t } = useLanguage();
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const sliderRef1 = useRef(null);
  const sliderRef2 = useRef(null);

  const NextArrow = ({ onClick }) => (
    <Box
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '50%',
        right: { xs: '-35px', sm: '-45px', md: '-55px' },
        transform: 'translateY(-50%)',
        zIndex: 2,
        cursor: 'pointer',
        color: '#1D70B8',
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '50%',
        width: { xs: 40, sm: 44, md: 48 },
        height: { xs: 40, sm: 44, md: 48 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'all 0.3s ease',
        border: '2px solid rgba(29, 112, 184, 0.12)',
        '&:hover': {
          bgcolor: 'white',
          boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
          color: '#1D70B8',
          transform: 'translateY(-50%) scale(1.1)',
          borderColor: 'rgba(29, 112, 184, 0.3)',
        }
      }}
    >
      <ArrowForwardIosIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
    </Box>
  );

  const PrevArrow = ({ onClick }) => (
    <Box
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '50%',
        left: { xs: '-35px', sm: '-45px', md: '-55px' },
        transform: 'translateY(-50%)',
        zIndex: 2,
        cursor: 'pointer',
        color: '#1D70B8',
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '50%',
        width: { xs: 40, sm: 44, md: 48 },
        height: { xs: 40, sm: 44, md: 48 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'all 0.3s ease',
        border: '2px solid rgba(29, 112, 184, 0.12)',
        '&:hover': {
          bgcolor: 'white',
          boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
          color: '#1D70B8',
          transform: 'translateY(-50%) scale(1.1)',
          borderColor: 'rgba(29, 112, 184, 0.3)',
        }
      }}
    >
      <ArrowBackIosIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 }, ml: 0.5 }} />
    </Box>
  );

  const getSlidesToShow = () => {
    if (isXsScreen) return 1;
    if (isSmallScreen) return 2;
    if (isMediumScreen) return 3;
    return 3;
  };

  const slidesToShow = getSlidesToShow();

  const settings = {
    dots: true,
    infinite: recetasMejorValoradas?.length > slidesToShow,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: recetasMejorValoradas?.length > slidesToShow,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    dotsClass: "slick-dots custom-dots",
    centerMode: false,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const sliderCustomStyles = {
    "& .slick-slide": {
      padding: { xs: "0 6px", sm: "0 8px", md: "0 12px" },
      boxSizing: "border-box",
      height: "auto"
    },
    "& .slick-track": {
      display: "flex",
      alignItems: "stretch",
      "& .slick-slide": {
        height: "auto",
        "& > div": {
          height: "100%"
        }
      }
    },
    "& .custom-dots": {
      bottom: { xs: -40, sm: -45, md: -50 },
      "& li button:before": {
        fontSize: { xs: 12, sm: 14, md: 16 },
        color: "#1D70B8",
        opacity: 0.5,
      },
      "& li.slick-active button:before": {
        opacity: 1,
      }
    },
    mb: { xs: 4, sm: 5, md: 6 },
    mt: { xs: 1, sm: 1.5, md: 2 },
    pb: { xs: 4, sm: 5, md: 6 }
  };

  const renderRecipeCard = (receta) => (
    <SlideWrapper key={receta.id}>
      <RecetaCard receta={receta} />
    </SlideWrapper>
  );

  const statsData = [
    {
      icon: <LocalFireDepartmentIcon sx={{ fontSize: { xs: 35, sm: 40, md: 45 } }} />,
      number: "1,250+",
      label: t('homePageCards.popularRecipes'),
      description: t('homePageCards.mostCookedByCommunity')
    },
    {
      icon: <GroupIcon sx={{ fontSize: { xs: 35, sm: 40, md: 45 } }} />,
      number: "15K+",
      label: t('Usuarios Activos'),
      description: t('homePage.stats.activeUsers')
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: { xs: 35, sm: 40, md: 45 } }} />,
      number: "30 min",
      label: t('homePage.averageTime'),
      description: t('homePage.stats.quickRecipes')
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: { xs: 35, sm: 40, md: 45 } }} />,
      number: "4.8★",
      label: t('homePage.averageRating'),
      description: t('homePage.stats.communityQuality')
    }
  ];

  return (
    <ResponsiveContainer maxWidth="xl">
      {/* Hero Section - Premium Welcome */}
      <Box
        sx={{
          position: "relative",
          mb: { xs: 8, sm: 10, md: 12 },
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 5, sm: 6, md: 8 },
          borderRadius: { xs: 4, sm: 6 },
          overflow: "hidden",
          background: "linear-gradient(135deg, #ffffff 0%, #f0f8ff 50%, #e6f0ff 100%)",
          boxShadow: "0 10px 40px rgba(29, 112, 184, 0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
          border: "1px solid rgba(29, 112, 184, 0.15)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(29, 112, 184, 0.05) 0%, transparent 70%)",
            borderRadius: "50%",
            transform: "translate(100px, -100px)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -50,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(29, 112, 184, 0.3), transparent)",
          }
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#1D70B8",
              fontWeight: 600,
              fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1rem" },
              letterSpacing: "1px",
              textTransform: "uppercase",
              mb: { xs: 2, sm: 2.5, md: 3 },
              opacity: 0.85
            }}
          >
            {t('homePage.welcome')}
          </Typography>
          
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "#1D70B8",
              mb: { xs: 2, sm: 2.5, md: 3 },
              fontSize: { xs: "2rem", sm: "2.75rem", md: "3.25rem", lg: "3.5rem" },
              lineHeight: { xs: 1.1, sm: 1.15, md: 1.2 },
              background: "linear-gradient(135deg, #1D70B8 0%, #005fcc 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            {t('homePage.discoverExcellence')}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "#555",
              maxWidth: { xs: "100%", sm: "650px", md: "900px" },
              mx: "auto",
              lineHeight: { xs: 1.5, sm: 1.6, md: 1.7 },
              fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.25rem", lg: "1.35rem" },
              fontWeight: 400,
              px: { xs: 1, sm: 0 }
            }}
          >
            {t('homePage.subtitle')}
          </Typography>
        </Box>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          sm: "1fr",
          md: "repeat(2, 1fr)"
        }}
        gap={{ xs: 2, sm: 3, md: 4 }}
        sx={{ mb: { xs: 6, sm: 8, md: 10 } }}
      >
        <Link to="/all-recipes" style={{ textDecoration: "none", height: "100%" }}>
          <StyledFeatureCard>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: { xs: 1.5, sm: 2 },
                color: "#1D70B8",
                flexDirection: { xs: "column", sm: "row" },
                textAlign: { xs: "center", sm: "left" }
              }}
            >
              <MenuBookIcon sx={{
                fontSize: { xs: 28, sm: 30, md: 32 },
                mr: { xs: 0, sm: 1.5 },
                mb: { xs: 1, sm: 0 }
              }} />
              <Typography variant="h5" sx={{
                fontWeight: 700,
                fontSize: { xs: "1.25rem", sm: "1.4rem", md: "1.5rem" }
              }}>
                {t('homePageCards.detailedRecipes')}
              </Typography>
            </Box>
            <Divider sx={{ mb: { xs: 1.5, sm: 2 } }} />
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: { xs: 1.5, sm: 2 },
                lineHeight: 1.7,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                textAlign: { xs: "center", sm: "left" }
              }}
            >
              {t('homePageCards.detailedDescription')}
            </Typography>
            <Box sx={{ mt: "auto", textAlign: { xs: "center", sm: "right" } }}>
              <Chip
                label={t('homePageCards.exploreRecipes')}
                size={isXsScreen ? "small" : "medium"}
                sx={{
                  bgcolor: "rgba(29, 112, 184, 0.12)",
                  color: "#1D70B8",
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                  '&:hover': {
                    bgcolor: "rgba(29, 112, 184, 0.22)",
                  }
                }}
              />
            </Box>
          </StyledFeatureCard>
        </Link>

        <Link to="/all-ingredients" style={{ textDecoration: "none", height: "100%" }} className="tarjeta-info" >
          <StyledFeatureCard>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: { xs: 1.5, sm: 2 },
                color: "#1D70B8",
                flexDirection: { xs: "column", sm: "row" },
                textAlign: { xs: "center", sm: "left" }
              }}
            >
              <SetMealIcon sx={{
                fontSize: { xs: 28, sm: 30, md: 32 },
                mr: { xs: 0, sm: 1.5 },
                mb: { xs: 1, sm: 0 }
              }} />
              <Typography variant="h5" sx={{
                fontWeight: 700,
                fontSize: { xs: "1.25rem", sm: "1.4rem", md: "1.5rem" }
              }}>
                {t('homePage.filterAllergens')}
              </Typography>
            </Box>
            <Divider sx={{ mb: { xs: 1.5, sm: 2 } }} />
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: { xs: 1.5, sm: 2 },
                lineHeight: 1.7,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                textAlign: { xs: "center", sm: "left" }
              }}
            >
              {t('homePage.filterDescription')}
            </Typography>
            <Box sx={{ mt: "auto", textAlign: { xs: "center", sm: "right" } }}>
              <Chip
                label={t('homePage.viewIngredients')}
                size={isXsScreen ? "small" : "medium"}
                sx={{
                  bgcolor: "rgba(29, 112, 184, 0.12)",
                  color: "#1D70B8",
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                  '&:hover': {
                    bgcolor: "rgba(29, 112, 184, 0.22)",
                  }
                }}
              />
            </Box>
          </StyledFeatureCard>
        </Link>
      </Box>

      {recetasMejorValoradas && recetasMejorValoradas.length > 0 && (
        <Box sx={{ mb: { xs: 6, sm: 8, md: 10 } }} className="carrusel-recetas">
          <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4 } }}>
            <SectionTitle variant="h4">
              {t('homePageCards.topRated')}
            </SectionTitle>
          </Box>

          <CarouselContainer>
            <Box sx={sliderCustomStyles}>
              <Slider ref={sliderRef1} {...settings}>
                {recetasMejorValoradas.map(renderRecipeCard)}
              </Slider>
            </Box>
          </CarouselContainer>
        </Box>
      )}

      <Box sx={{ mb: 15 }}>
        <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 5, md: 6 } }}>
          <SectionTitle variant="h4">
            Nuestra comunidad culinaria
          </SectionTitle>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: "600px",
              mx: "auto",
              fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
              lineHeight: 1.6,
              px: { xs: 2, sm: 0 }
            }}
          >
            Únete a miles de amantes de la cocina que comparten, descubren y disfrutan cada día.
          </Typography>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)"
          }}
          gap={{ xs: 2, sm: 3, md: 3 }}
        >
          {statsData.map((stat, index) => (
            <StyledStatsCard key={index}>
              <Box sx={{ mb: 2, position: "relative", zIndex: 1 }}>
                {stat.icon}
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                  position: "relative",
                  zIndex: 1
                }}
              >
                {stat.number}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                  position: "relative",
                  zIndex: 1
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                  lineHeight: 1.4,
                  position: "relative",
                  zIndex: 1
                }}
              >
                {stat.description}
              </Typography>
            </StyledStatsCard>
          ))}
        </Box>
      </Box>

      {recetasMasVistas && recetasMasVistas.length > 0 && (
        <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }} className="carrusel-recetas">
          <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4 } }}>
            <SectionTitle variant="h4">
              {t('homePageCards.mostViewed')}
            </SectionTitle>
          </Box>

          <CarouselContainer>
            <Box sx={sliderCustomStyles}>
              <Slider ref={sliderRef2} {...settings}>
                {recetasMasVistas.map(renderRecipeCard)}
              </Slider>
            </Box>
          </CarouselContainer>
        </Box>
      )}

      <Box
        sx={{
          mt: { xs: 8, sm: 10, md: 12 },
          mx: { xs: 1, sm: 2, md: 0 },
          px: { xs: 3, sm: 4, md: 6 },
          py: { xs: 5, sm: 6, md: 7 },
          borderRadius: { xs: 4, sm: 6 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #ffffff 0%, #f0f8ff 50%, #e6f0ff 100%)",
          border: "1px solid rgba(29, 112, 184, 0.1)",
          boxShadow: "0 8px 32px rgba(29, 112, 184, 0.1), inset 0 1px 0 rgba(255,255,255,0.5)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(29, 112, 184, 0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -50,
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(29, 112, 184, 0.25), transparent)",
          }
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#1D70B8",
              mb: { xs: 2, sm: 2.5, md: 3 },
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.35rem" },
              lineHeight: 1.2
            }}
          >
            ¿Listo para ser tu propio chef?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: { xs: 3, sm: 4 },
              color: "#666",
              maxWidth: { xs: "100%", sm: "650px", md: "800px" },
              mx: "auto",
              fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.15rem" },
              lineHeight: { xs: 1.6, sm: 1.7 },
              px: { xs: 1, sm: 0 }
            }}
          >
            {t('homePageCards.finalCTA')}
          </Typography>
        </Box>
      </Box>
    </ResponsiveContainer>
  );
}

HomePage.propTypes = {
  onClick: PropTypes.func,
};
