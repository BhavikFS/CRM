export const changePCStatus = (status, financeUserStatus) => {
    let changedStatus = "";
    switch (status) {
      case "ReviewRequired":
      case "ReviewBack": // Handle ReviewBack as ReviewRequired
        changedStatus = "ReviewRequired";
        break;
      case "rejected":
        changedStatus = "rejected";
        break;
      case "approved":
        switch (financeUserStatus) {
          case "pending":
            changedStatus = "pending";
            break;
          case "rejected":
            changedStatus = "rejected";
            break;
          case "ReviewRequired":
          case "ReviewBack": // Handle ReviewBack as ReviewRequired
            changedStatus = "ReviewRequired";
            break;
          default:
            changedStatus = "approved";
            break;
        }
        break;
      default:
        // Return unchanged status if no matching case is found
        changedStatus = status;
        break;
    }
    return changedStatus;
  };

  export const changeCOStatus = (status, pricingUserStatus) => {
    let changedStatus = "";
  
    switch (status) {
      case "rejected":
        changedStatus = "Rejected";
        break;
  
      case "approved":
        switch (pricingUserStatus) {
          case "pending":
            changedStatus = "pending";
            break;
          case "ReviewRequired":
          case "ReviewBack": // Handle ReviewBack as ReviewRequired
            changedStatus = "ReviewRequired";
            break;
          case "rejected":
            changedStatus = "rejected";
            break;
          default:
            changedStatus = "approved";
            break;
        }
        break;
  
      default:
        changedStatus = status;
        break;
    }
  
    return changedStatus;
  };
