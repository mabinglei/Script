// ==UserScript==
// @name         MCC Display
// @namespace    http://tampermonkey.net/
// @version      2025-04-25
// @description  MCC Display
// @author       misc
// @match        https://secure.chase.com/*
// @match        https://myaccounts.capitalone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=podiumrewards.com
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';
  console.debug('MCC Display');
  const _xhr_open = unsafeWindow.XMLHttpRequest.prototype.open;
  const _xhr_send = unsafeWindow.XMLHttpRequest.prototype.send;

  unsafeWindow.XMLHttpRequest.prototype.open = function (_, url) {
    this.requestURL = url;
    return _xhr_open.apply(this, arguments);
  };

  unsafeWindow.XMLHttpRequest.prototype.send = function () {
    const self = this;
    const _onreadystatechange = this.onreadystatechange;
    this.onreadystatechange = function () {
      if (self.readyState === 4) {
        const _responseText = self.responseText;
        let modifiedResponseText = _responseText;
        let modifiedResponse = self.response;

        if (self.status === 200) {
          let isModified = false;

          if (
            self.requestURL?.includes(
              `/svc/rr/accounts/secure/gateway/credit-card/transactions/inquiry-maintenance/etu-transactions/v4/accounts/transactions`,
            )
          ) {
            const data = JSON.parse(_responseText);
            data.activities.forEach((row) => {
              const { enrichedMerchants, rawMerchantDetails } = row.merchantDetails;
              const { merchantCategoryCode, merchantDbaName } = rawMerchantDetails || {};

              if (rawMerchantDetails) {
                rawMerchantDetails.merchantDbaName = `${merchantCategoryCode}: ${merchantDbaName}`;
              }

              if (enrichedMerchants?.[0]) {
                enrichedMerchants[0].merchantName = `${merchantCategoryCode}: ${enrichedMerchants?.[0].merchantName}`;
              }
            });

            modifiedResponseText = JSON.stringify(data, null);
            modifiedResponse = data;
            isModified = true;
          }

          if (self.requestURL?.includes(`/web-api/protected/19902/credit-cards/accounts/`)) {
            const data = JSON.parse(_responseText);
            data.entries.forEach((row) => {
              const { categoryCode } = row.transactionMerchant || {};
              if (categoryCode) {
                row.transactionDescription = `${categoryCode}: ${row.transactionDescription}`;
              }
            });

            modifiedResponseText = JSON.stringify(data, null);
            modifiedResponse = data;
            isModified = true;
          }

          if (isModified) {
            try {
              Object.defineProperty(self, 'responseText', {
                value: modifiedResponseText,
                writable: false, // Prevent page scripts from writing back
                configurable: true, // Allow potential future re-definition
              });

              console.log('[XHR Modify] redefined responseText');
            } catch (e) {
              console.error('[XHR Modify] Error redefining responseText:', e);
            }

            try {
              Object.defineProperty(self, 'response', {
                value: modifiedResponse, // Use the potentially modified object/text
                writable: false,
                configurable: true,
              });

              console.log('[XHR Modify] redefined response');
            } catch (e) {
              console.error('[XHR Modify] Error redefining response:', e);
            }

            isModified = false;
          }
        }
      }

      if (_onreadystatechange) {
        return _onreadystatechange.apply(this, arguments);
      }
    };

    return _xhr_send.apply(this, arguments);
  };
})();
