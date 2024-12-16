// components/ApprovePO.js
import React, { useState } from "react";
import { Input, Button, notification } from "antd";
import axios from "axios";

const ApprovePO = () => {
  const [poId, setPoId] = useState("");

  const handleApprove = async () => {
    try {
      const response = await axios.put(`https://gold.annk.info/api/purchaseorders/${poId}/approve`);
      notification.success({
        message: "Success",
        description: "Purchase order approved and items imported to warehouse!",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to approve purchase order.",
      });
    }
  };

  return (
    <div>
      <Input
        value={poId}
        onChange={(e) => setPoId(e.target.value)}
        placeholder="Enter PO ID to approve"
      />
      <Button type="primary" onClick={handleApprove}>
        Approve PO
      </Button>
    </div>
  );
};

export default ApprovePO;
