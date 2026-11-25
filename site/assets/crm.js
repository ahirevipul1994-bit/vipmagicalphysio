(function () {
  "use strict";

  const legacyKeys = ["px_booking_draft_v1", "px_last_enquiry", "px_last_request", "px_requests", "px_leads", "px_crm_queue"];
  try {
    legacyKeys.forEach(key => localStorage.removeItem(key));
  } catch {}
})();
