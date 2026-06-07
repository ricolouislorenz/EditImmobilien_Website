export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ExposeRequestData {
  name: string;
  email: string;
  phone: string;
  message?: string;
  /** Objektnummer der Immobilie, z. B. "EI-005" */
  property_id: string;
  property_title: string;
}
