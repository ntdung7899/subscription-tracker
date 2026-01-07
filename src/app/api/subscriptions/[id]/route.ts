import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/subscriptions/[id] - Lấy chi tiết subscription
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: params.id },
      include: {
        familyGroups: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

// PUT /api/subscriptions/[id] - Cập nhật subscription
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    // console.log('PUT /api/subscriptions/[id] - Received body:', JSON.stringify(body, null, 2))
    // console.log('Subscription ID:', params.id)

    // First, delete all existing family groups and members
    await prisma.familyGroup.deleteMany({
      where: { subscriptionId: params.id },
    });
    // console.log('Deleted existing family groups')

    // console.log('Deleted existing family groups')

    // Filter out invalid family groups (only check for non-empty name)
    const validFamilyGroups = body.familyGroups
      ? body.familyGroups.filter((group: any) => {
          const isValid = group.name && group.name.trim() !== "";

          if (!isValid) {
            // console.log('Invalid group filtered out:', {
            //   name: group.name,
            //   hasName: !!group.name,
            //   nameNotEmpty: group.name ? group.name.trim() !== '' : false,
            // });
          }

          return isValid;
        })
      : [];

    // console.log(
    //   "Total family groups received:",
    //   body.familyGroups?.length || 0
    // );
    // console.log("Valid family groups count:", validFamilyGroups.length);
    // console.log(
    //   "Valid family groups:",
    //   JSON.stringify(validFamilyGroups, null, 2)
    // );

    // Then update subscription with new data
    const subscription = await prisma.subscription.update({
      where: { id: params.id },
      data: {
        appName: body.appName,
        category: body.category,
        price: parseInt(body.price),
        currency: body.currency,
        billingCycle: body.billingCycle,
        notificationDays: parseInt(body.notificationDays),
        isShared: body.isShared,
        familyGroups:
          validFamilyGroups.length > 0
            ? {
                create: validFamilyGroups.map((group: any) => ({
                  name: group.name,
                  purchaseDate: group.purchaseDate
                    ? new Date(group.purchaseDate)
                    : null,
                  expirationDate: group.expirationDate
                    ? new Date(group.expirationDate)
                    : null,
                  notes: group.notes || null,
                  members: {
                    create: (group.members || []).map((member: any) => ({
                      name: member.name,
                      email: member.email,
                      amountPaid: parseInt(member.amountPaid) || 0,
                      nextPaymentDate: new Date(
                        member.nextPaymentDate
                      ).toISOString(),
                      status: member.status || "active",
                    })),
                  },
                })),
              }
            : undefined,
      },
      include: {
        familyGroups: {
          include: {
            members: true,
          },
        },
      },
    });

    // console.log("Subscription updated successfully:", subscription.id);
    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error updating subscription:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      {
        error: "Failed to update subscription",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/subscriptions/[id] - Xóa subscription
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.subscription.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Subscription deleted successfully" });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}
