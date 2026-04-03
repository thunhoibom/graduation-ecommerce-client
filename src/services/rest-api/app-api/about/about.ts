import { CompanyDetailsPojo } from '../types';
import { aboutService } from './_service-instance';

export const fetchCompanyDetails = () =>
  aboutService.get<CompanyDetailsPojo>('/about');

export const aboutApi = Object.freeze({
  fetchDetails: fetchCompanyDetails,
});
