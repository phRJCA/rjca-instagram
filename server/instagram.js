import { Meteor } from "meteor/meteor";
import axios from "axios";

/* ****************
  Notes: long_lived_access_token s are valid for 60 days
  // https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens#get-a-long-lived-token
**************** */

class Instagram {
  constructor({ userId, accessToken }) {
    this.userId = userId;
    this.accessToken = accessToken;
    this.graphUrl = "https://graph.instagram.com";
  }

  async self() {
    try {
      const me = await axios.get(`${this.graphUrl}/me`, {
        params: {
          fields: "id,username",
          access_token: this.accessToken,
        },
      });

      return me.data;
    } catch (e) {
      console.error("Unhandled exception:", e);
    }
  }

  async media(userId) {
    const mediaUrl = userId ? `${this.graphUrl}/${userId}/media` : `${this.graphUrl}/me/media`;
    try {
      const media = await axios.get(mediaUrl, {
        params: {
          fields: "id,caption",
          access_token: this.accessToken,
        },
      });

      return media.data;
    } catch (e) {
      console.error("Unhandled exception:", e);
    }
  }
}

const InstagramAPI = new Instagram({
  userId: Meteor.settings.instagram.user_id,
  accessToken: Meteor.settings.instagram.long_lived_access_token,
});

// InstagramAPI.user(Meteor.settings.instagram.rjca_user_id);

export default InstagramAPI;
