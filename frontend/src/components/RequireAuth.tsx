import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import { getToken } from "../slices/authSlice";
import {
  fetchSite,
  getSiteStatus,
  isPublic,
  SiteStatus,
} from "../slices/sitesSlice";
import SiteAccessForbiddenView from "../views/SiteAccessForbiddenView";
import SiteLoadingView from "../views/SiteLoadingView";
import SiteNetworkErrorView from "../views/SiteNetworkErrorView";
import SiteNotFoundView from "../views/SiteNotFoundView";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const token = useSelector(getToken);
  const isPublicSite = useSelector(isPublic);
  let location = useLocation();
  const dispatch = useDispatch();
  const siteStatus = useSelector(getSiteStatus);

  useEffect(() => {
    dispatch(fetchSite());
  }, [dispatch]);

  if (siteStatus === SiteStatus.Unknown) {
    return <SiteLoadingView />;
  } else if (siteStatus === SiteStatus.NotFound) {
    return <SiteNotFoundView />;
  } else if (siteStatus === SiteStatus.AccessForbidden) {
    return <SiteAccessForbiddenView />;
  } else if (siteStatus === SiteStatus.NetworkError) {
    return <SiteNetworkErrorView />;
  }

  if (!isPublicSite && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}